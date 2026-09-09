import axios from "axios";
import { getAccessToken, saveAccessToken, removeAccessToken } from "../utils/tokenStorage";

const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,

    headers: {
        "Content-Type": "application/json",
    },

    timeout: 10000,
});

/*
|--------------------------------------------------------------------------
| Request Interceptor
|--------------------------------------------------------------------------
|
| Add the access token to every authenticated request.
|
*/

client.interceptors.request.use(
    (config) => {

        const accessToken = getAccessToken();

        if (accessToken) {
            config.headers.Authorization =
                `Bearer ${accessToken}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);


/*
|--------------------------------------------------------------------------
| Response Interceptor
|--------------------------------------------------------------------------
|
| If the access token has expired:
|
| 1. Call /auth/refresh/
| 2. Browser automatically sends the HttpOnly refresh cookie
| 3. Save the new access token in memory
| 4. Retry the original request
|
*/

let isRefreshing = false;

let refreshSubscribers = [];


function subscribeToTokenRefresh(callback) {
    refreshSubscribers.push(callback);
}


function notifyTokenRefresh(newToken) {

    refreshSubscribers.forEach(
        (callback) => callback(newToken)
    );

    refreshSubscribers = [];
}


// client.interceptors.response.use(
//     (response) => {
//         return response;
//     },

//     async (error) => {

//         const originalRequest = error.config;

//         /*
//         |--------------------------------------------------------------------------
//         | Only handle 401 errors
//         |--------------------------------------------------------------------------
//         */

//         if (
//             error.response?.status !== 401 ||
//             originalRequest._retry
//         ) {
//             return Promise.reject(error);
//         }


//         /*
//         |--------------------------------------------------------------------------
//         | Don't try to refresh the refresh request itself
//         |--------------------------------------------------------------------------
//         */

//         if (
//             originalRequest.url?.includes(
//                 "/auth/refresh/"
//             )
//         ) {
//             removeAccessToken();

//             return Promise.reject(error);
//         }


//         /*
//         |--------------------------------------------------------------------------
//         | If another request is already refreshing the token,
//         | wait for it.
//         |--------------------------------------------------------------------------
//         */

//         if (isRefreshing) {

//             return new Promise((resolve, reject) => {

//                 subscribeToTokenRefresh(
//                     (newToken) => {

//                         originalRequest.headers.Authorization =
//                             `Bearer ${newToken}`;

//                         resolve(
//                             client(originalRequest)
//                         );
//                     }
//                 );

//             });
//         }


//         /*
//         |--------------------------------------------------------------------------
//         | Start refreshing
//         |--------------------------------------------------------------------------
//         */

//         originalRequest._retry = true;

//         isRefreshing = true;


//         try {

//             /*
//             |--------------------------------------------------------------------------
//             | The refresh token is NOT sent manually.
//             |
//             | The browser automatically sends the HttpOnly
//             | refresh_token cookie because of withCredentials: true.
//             |--------------------------------------------------------------------------
//             */

//             const response = await client.post(
//                 "/auth/refresh/"
//             );


//             const newAccessToken =
//                 response.data.access;


//             /*
//             |--------------------------------------------------------------------------
//             | Store the new access token in memory
//             |--------------------------------------------------------------------------
//             */

//             saveAccessToken(newAccessToken);


//             /*
//             |--------------------------------------------------------------------------
//             | Notify requests that were waiting
//             |--------------------------------------------------------------------------
//             */

//             notifyTokenRefresh(
//                 newAccessToken
//             );


//             /*
//             |--------------------------------------------------------------------------
//             | Retry the original request
//             |--------------------------------------------------------------------------
//             */

//             originalRequest.headers.Authorization =
//                 `Bearer ${newAccessToken}`;


//             return client(originalRequest);

//         } catch (refreshError) {

//             /*
//             |--------------------------------------------------------------------------
//             | Refresh token is invalid/expired.
//             |
//             | Clear the access token.
//             |--------------------------------------------------------------------------
//             */

//             removeAccessToken();

//             refreshSubscribers = [];

//             return Promise.reject(
//                 refreshError
//             );

//         } finally {

//             isRefreshing = false;

//         }
//     }
// );


export default client;