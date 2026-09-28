import { X } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function DashboardSidebar({
    menuItems,
    open,
    onClose,
}) {
    return (
        <>
            {/* Mobile backdrop */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 w-64
                    border-r border-secondary-200
                    bg-white
                    transition-transform duration-300
                    lg:translate-x-0
                    ${open
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }
                `}
            >
                {/* Sidebar header */}
                <div className="flex h-16 items-center justify-between border-b border-secondary-200 px-4">
                    <span className="text-lg font-semibold text-secondary-900">
                        Menu
                    </span>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-secondary-600 hover:bg-secondary-100 lg:hidden"
                        aria-label="Close navigation"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="space-y-1 p-4">
                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                                        ? "bg-primary-50 text-primary-700"
                                        : "text-secondary-700 hover:bg-secondary-100"
                                    }`
                                }
                            >
                                <Icon size={18} />

                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}