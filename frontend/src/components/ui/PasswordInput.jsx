import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import Input from "./Input";

export default function PasswordInput({
    showStrength = false,
    ...props
}) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Input
            {...props}
            type={showPassword ? "text" : "password"}
            rightIcon={
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="
                        flex
                        items-center
                        justify-center
                        text-secondary-700
                        hover:text-primary-600
                        transition-colors
                    "
                    aria-label={
                        showPassword
                            ? "Hide password"
                            : "Show password"
                    }
                >
                    {showPassword
                        ? <EyeOff size={18} />
                        : <Eye size={18} />}
                </button>
            }
        />
    );
}