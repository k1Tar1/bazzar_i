import { Button, Input, Checkbox, Alert, Card, Divider, Select } from "../components/ui/index";
import { Mail, Plus, ArrowRight, Star, MapPinned } from "lucide-react";

export default function ComponentGallery() {

    const wilayas = [
        { value: "01", label: "Adrar" },
        { value: "02", label: "Chlef" },
        { value: "03", label: "Laghouat" },
        { value: "04", label: "Oum El Bouaghi" },
    ];

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
                    Selects
                </h2>

                <div className="space-y-6 max-w-md">

                    <Select
                        label="Wilaya"
                        options={wilayas}
                    />

                    <Select
                        label="With Helper"
                        helperText="Select your current wilaya."
                        options={wilayas}
                    />

                    <Select
                        label="Error"
                        error="Required field."
                        options={wilayas}
                    />

                    <Select
                        label="Disabled"
                        disabled
                        options={wilayas}
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

                <h2 className="text-2xl font-semibold">
                    Cards
                </h2>

                <div className="space-y-6">

                    <Card title="Simple Card">
                        Basic card content.
                    </Card>

                    <Card
                        title="Hover Card"
                        subtitle="Hover over this card."
                        hover
                    >
                        Content
                    </Card>

                    <Card
                        title="With Footer"
                        footer={
                            <Button>
                                Save
                            </Button>
                        }
                    >
                        Card body
                    </Card>

                    <Card
                        header={
                            <div className="flex items-center justify-between">

                                <h2 className="text-lg font-semibold">
                                    Recent Orders
                                </h2>

                                <Button size="sm">
                                    View All
                                </Button>

                            </div>
                        }
                    >
                        ...
                    </Card>

                </div>

                <h2 className="text-2xl font-semibold">
                    Dividers
                </h2>

                <div className="space-y-8">

                    <Divider />

                    <Divider>
                        OR
                    </Divider>

                    <Divider>
                        Login
                    </Divider>

                    <Divider>
                        Step 2
                    </Divider>

                    <Divider>
                        <Star size={16} />
                    </Divider>
                </div>

                <div className="flex h-8 items-center gap-4 justify-center">
                    <span>Profile</span>

                    <Divider orientation="vertical" />

                    <span>Settings</span>

                    <Divider orientation="vertical" />

                    <span>Logout</span>
                </div>
            </section>


        </div>
    );
}