export default function mapBackendErrors(data) {
    const errors = {};

    for (const key in data) {
        const value = data[key];
        errors[key] = Array.isArray(value) ? value[0] : value;
    }

    return errors;
}