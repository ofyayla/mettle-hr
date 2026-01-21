import { useState } from 'react';

const initialIntegrations = [
    {
        id: 'workday',
        name: 'Workday',
        description: 'Sync employee data and org charts automatically.',
        category: 'HRIS',
        connected: false,
        icon: 'https://companieslogo.com/img/orig/WDAY-45a9092d.png?t=1650371404'
    },
    {
        id: 'slack',
        name: 'Slack',
        description: 'Send interview reminders and notifications to Slack channels.',
        category: 'Communication',
        connected: true,
        icon: 'https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/306_Slack_logo-512.png'
    },
    {
        id: 'zoom',
        name: 'Zoom',
        description: 'Automatically generate meeting links for interviews.',
        category: 'Video Conferencing',
        connected: false,
        icon: 'https://cdn4.iconfinder.com/data/icons/logos-brands-in-colors/404/c_logo-zoom-512.png'
    },
    {
        id: 'gmail',
        name: 'Gmail',
        description: 'Sync calendar and emails for seamless communication.',
        category: 'Calendar',
        connected: true,
        icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Gmail_icon_%282020%29.svg/2560px-Gmail_icon_%282020%29.svg.png'
    }
];

export function IntegrationsPage() {
    const [integrations, setIntegrations] = useState(initialIntegrations);

    const toggleConnection = (id: string) => {
        setIntegrations(integrations.map(integration =>
            integration.id === id ? { ...integration, connected: !integration.connected } : integration
        ));
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Integrations</h3>
                <p className="text-sm text-muted-foreground">
                    Connect your existing tools to streamline your workflow.
                </p>
            </div>

            <div className="my-6 border-t border-border" />

            <div className="grid gap-6">
                {integrations.map((integration) => (
                    <div key={integration.id} className="flex items-start space-x-4 rounded-lg border border-input p-4 transition-all hover:bg-muted/50">
                        <div className="h-10 w-10 flex-shrink-0 bg-white rounded-md p-1 border border-border">
                            <img src={integration.icon} alt={integration.name} className="h-full w-full object-contain" />
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium leading-none">{integration.name}</p>
                                <button
                                    onClick={() => toggleConnection(integration.id)}
                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${integration.connected ? 'bg-primary' : 'bg-input'
                                        }`}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out ${integration.connected ? 'translate-x-5' : 'translate-x-0'
                                            }`}
                                    />
                                </button>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {integration.description}
                            </p>
                            <div className="flex items-center pt-2">
                                <span className="inline-flex items-center rounded-sm bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                                    {integration.category}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
