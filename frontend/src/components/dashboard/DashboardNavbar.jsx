import DashboardSwitcher from "./DashboardSwitcher";
import UserMenu from "./UserMenu";
import { Menu } from "lucide-react";
import Button from "../ui/Button";
export default function DashboardNavbar({
    onMenuClick,
}) {
    return (
        <header className="h-16 border-b border-secondary-200 bg-white">
            <div className="flex h-full items-center justify-between px-6">
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="rounded-lg p-2 text-secondary-600 hover:bg-secondary-100 lg:hidden"
                    aria-label="Open navigation"
                >
                    <Menu size={22} />
                </button>
                <div className="text-lg font-semibold text-secondary-900">
                    YourStore
                </div>

                <div className="flex items-center gap-4">
                    <DashboardSwitcher />

                    <UserMenu />
                </div>
            </div>
        </header>
    );
}