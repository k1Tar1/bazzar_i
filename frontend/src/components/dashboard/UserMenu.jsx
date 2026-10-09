import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    User,
    Settings,
    Lock,
    LogOut,
    Store,
    ChevronDown,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

export default function UserMenu() {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);

    async function handleLogout() {
        setOpen(false);
        await logout();
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (!event.target.closest("[data-user-menu]")) {
                setOpen(false);
            }
        }

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    return (
        <div className="relative" data-user-menu>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-secondary-700 hover:bg-secondary-100"
            >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-200">
                    <User size={18} />
                </div>

                <span>
                    {user?.first_name || user?.email}
                </span>

                <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${open ? "rotate-180" : ""
                        }`}
                />
            </button>

            {open && (
                <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-secondary-200 bg-white py-2 shadow-lg">

                    <Link
                        to="/account/profile"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                    >
                        <User size={17} />
                        Profile
                    </Link>

                    {!user?.is_seller && !user?.is_admin && (
                        <Link
                            to="/account/become-seller"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                        >
                            <Store size={17} />
                            Become a Seller
                        </Link>
                    )}

                    {user?.is_seller && (
                        <>
                            <Link
                                to="/account/seller-status"
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-3 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                            >
                                <Store size={17} />
                                Seller Status
                            </Link>

                            <Link
                                to="/account/seller-verification"
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-3 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                            >
                                <Store size={17} />
                                Identity Verification
                            </Link>

                            <Link
                                to="/account/seller-profile"
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-3 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                            >
                                <Store size={17} />
                                Seller Profile
                            </Link>
                        </>
                    )}

                    <Link
                        to="/account/settings"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                    >
                        <Settings size={17} />
                        Settings
                    </Link>

                    <Link
                        to="/account/change-password"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                    >
                        <Lock size={17} />
                        Change Password
                    </Link>

                    <div className="my-2 border-t border-secondary-200" />

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-2 text-sm text-danger-600 hover:bg-secondary-100"
                    >
                        <LogOut size={17} />
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}