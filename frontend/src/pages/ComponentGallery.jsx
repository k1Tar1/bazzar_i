import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Checkbox from "../components/ui/Checkbox";
import Alert from "../components/ui/Alert";
import { Mail, Plus, ArrowRight } from "lucide-react";

export default function ComponentGallery() {
    return (
        <div className="space-y-12 p-8">

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">
                    Buttons
                </h2>

                <div className="flex flex-wrap items-center gap-4">
                    <Button>Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="danger">Danger</Button>
                    <Button variant="success">Success</Button>
                    <Button loading loadingText="loading...">Loading</Button>
                    <Button leftIcon={<Plus size={18} />}>Add Product</Button>
                    <Button rightIcon={<ArrowRight size={18} />}>Get Started</Button>
                </div>

                <h2 className="text-2xl font-semibold">
                    Inputs
                </h2>

                <div className="flex flex-col gap-6 max-w-md">

                    {/* <input
                        style={{
                            paddingLeft: "100px",
                        }}
                        label="test"
                        placeholder="test"
                    /> */}

                    <Input
                        label="Email"
                        placeholder="john@example.com"
                        leftIcon={<Mail size={18} />}
                    />

                    <Input
                        label="Password"
                        helperText="Minimum 8 characters."
                    />

                    <Input
                        label="Email"
                        error="Email already exists."
                    />

                    <Input
                        label="Disabled"
                        disabled
                    />

                    <Input
                        label="Read only"
                        readOnly
                        defaultValue="example@email.com"
                    />

                    <Input
                        label="Password"
                        type="password"
                        required
                        helperText="Must be at least 8 characters."
                    />

                    <Input
                        label="Confirm Password"
                        type="password"
                        required
                        showPasswordToggle={false}
                        error="Passwords do not match."
                    />

                </div>

                <h2 className="text-2xl font-semibold">
                    Checkboxes
                </h2>

                <div className="space-y-6">

                    <Checkbox
                        label="Basic checkbox"
                    />

                    <Checkbox
                        defaultChecked
                        label="Checked"
                    />

                    <Checkbox
                        helperText="Receive occasional updates."
                        label="Newsletter"
                    />

                    <Checkbox
                        error="This field is required."
                        label="Terms"
                        required
                    />

                    <Checkbox
                        disabled
                        label="Disabled"
                    />

                </div>

                <h2 className="text-2xl font-semibold">
                    Alerts
                </h2>

                <div className="space-y-4">

                    <Alert
                        variant="success"
                        title="Success"
                        dismissible
                    >
                        Everything worked correctly.
                    </Alert>

                    <Alert
                        variant="error"
                        title="Error"
                    >
                        Something went wrong.
                    </Alert>

                    <Alert
                        variant="warning"
                        title="Warning"
                    >
                        This action cannot be undone.
                    </Alert>

                    <Alert
                        variant="info"
                        title="Information"
                    >
                        Please verify your email address.
                    </Alert>

                </div>

            </section>


        </div>
    );
}