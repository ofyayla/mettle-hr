import { useState } from 'react';

export function GeneralSettingsPage() {
    const [loading, setLoading] = useState(false);

    // Mock initial state
    const [formData, setFormData] = useState({
        companyName: 'Acme Corp',
        website: 'https://acme.inc',
        supportEmail: 'support@acme.inc',
        primaryColor: '#000000'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Company Profile</h3>
                <p className="text-sm text-muted-foreground">
                    This is how others will see you on the site.
                </p>
            </div>

            <div className="my-6 border-t border-border" />

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium leading-none" htmlFor="companyName">
                            Company Name
                        </label>
                        <input
                            id="companyName"
                            name="companyName"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.companyName}
                            onChange={handleChange}
                        />
                        <p className="text-[0.8rem] text-muted-foreground">
                            This is the name that will be displayed on your profile and int emails.
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <label className="text-sm font-medium leading-none" htmlFor="website">
                            Website
                        </label>
                        <input
                            id="website"
                            name="website"
                            type="url"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.website}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid gap-2">
                        <label className="text-sm font-medium leading-none" htmlFor="supportEmail">
                            Support Email
                        </label>
                        <input
                            id="supportEmail"
                            name="supportEmail"
                            type="email"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.supportEmail}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium mb-4">Localization</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium leading-none" htmlFor="timezone">
                                Timezone
                            </label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                defaultValue="America/Los_Angeles"
                            >
                                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                                <option value="America/New_York">Eastern Time (ET)</option>
                                <option value="Europe/London">London (GMT)</option>
                                <option value="Europe/Istanbul">Istanbul (GMT+3)</option>
                                <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium leading-none" htmlFor="currency">
                                Currency
                            </label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                defaultValue="USD"
                            >
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                                <option value="TRY">TRY (₺)</option>
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium leading-none" htmlFor="dateFormat">
                                Date Format
                            </label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                defaultValue="MM/DD/YYYY"
                            >
                                <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2024)</option>
                                <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2024)</option>
                                <option value="YYYY-MM-DD">YYYY-MM-DD (2024-12-31)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border" />

                <div>
                    <h3 className="text-lg font-medium mb-4">Branding</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium leading-none" htmlFor="primaryColor">
                                Brand Color (Primary)
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    id="primaryColor"
                                    name="primaryColor"
                                    type="color"
                                    className="h-10 w-20 rounded-md border border-input bg-background p-1 cursor-pointer"
                                    value={formData.primaryColor}
                                    onChange={handleChange}
                                />
                                <span className="text-sm text-muted-foreground">{formData.primaryColor}</span>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium leading-none">
                                Company Logo
                            </label>
                            <div className="border-2 border-dashed border-input rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer">
                                <span className="text-sm text-muted-foreground">Drop logo here or click to upload</span>
                                <span className="text-xs text-muted-foreground mt-1">(Max 2MB, PNG/JPG)</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-start">
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                        {loading ? 'Saving...' : 'Update profile'}
                    </button>
                </div>
            </form>
        </div>
    );
}
