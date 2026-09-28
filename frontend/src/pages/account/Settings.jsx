import { useState } from "react";
import { Bell, Save } from "lucide-react";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

export default function Settings() {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [orderNotifications, setOrderNotifications] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setSaving(true);
        setSuccess(false);

        // Backend settings endpoint will be added later.
        // For now, simulate saving.
        await new Promise((resolve) =>
            setTimeout(resolve, 500)
        );

        setSaving(false);
        setSuccess(true);
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-secondary-900">
                    Settings
                </h1>

                <p className="mt-1 text-sm text-secondary-500">
                    Manage your account preferences.
                </p>
            </div>

            {success && (
                <div className="rounded-lg border border-success-200 bg-success-50 px-4 py-3 text-sm text-success-700">
                    Your settings have been saved.
                </div>
            )}

            <Card>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                                <Bell size={20} />
                            </div>

                            <div>
                                <h2 className="font-semibold text-secondary-900">
                                    Notifications
                                </h2>

                                <p className="text-sm text-secondary-500">
                                    Choose which notifications you want to receive.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="flex cursor-pointer items-start gap-3">
                            <input
                                type="checkbox"
                                checked={emailNotifications}
                                onChange={(event) =>
                                    setEmailNotifications(
                                        event.target.checked
                                    )
                                }
                                className="mt-1 h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-300"
                            />

                            <div>
                                <p className="text-sm font-medium text-secondary-900">
                                    Email notifications
                                </p>

                                <p className="text-sm text-secondary-500">
                                    Receive important account notifications by email.
                                </p>
                            </div>
                        </label>

                        <label className="flex cursor-pointer items-start gap-3">
                            <input
                                type="checkbox"
                                checked={orderNotifications}
                                onChange={(event) =>
                                    setOrderNotifications(
                                        event.target.checked
                                    )
                                }
                                className="mt-1 h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-300"
                            />

                            <div>
                                <p className="text-sm font-medium text-secondary-900">
                                    Order notifications
                                </p>

                                <p className="text-sm text-secondary-500">
                                    Receive updates about your orders.
                                </p>
                            </div>
                        </label>
                    </div>

                    <div className="flex justify-end border-t border-secondary-200 pt-6">
                        <Button
                            type="submit"
                            loading={saving}
                            leftIcon={<Save size={18} />}
                        >
                            Save Settings
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}