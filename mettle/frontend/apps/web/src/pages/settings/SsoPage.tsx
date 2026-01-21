import { useState } from 'react';
import { Lock, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

export function SsoPage() {
    const [ssoEnabled, setSsoEnabled] = useState(false);
    const [protocol, setProtocol] = useState<'saml' | 'oidc'>('saml');
    const [status, setStatus] = useState<'configured' | 'pending' | 'error'>('pending');

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium flex items-center gap-2">
                        <Lock className="h-5 w-5 text-primary" />
                        Single Sign-On (SSO)
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Configure SAML 2.0 or OIDC to allow your employees to sign in with your identity provider.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">Enable SSO</label>
                    <button
                        onClick={() => setSsoEnabled(!ssoEnabled)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${ssoEnabled ? 'bg-primary' : 'bg-input'}`}
                    >
                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out ${ssoEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                </div>
            </div>

            <div className="my-6 border-t border-border" />

            {ssoEnabled ? (
                <div className="space-y-8">
                    {/* Status Card */}
                    <div className={`p-4 rounded-lg border ${status === 'configured' ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                        <div className="flex items-start gap-3">
                            {status === 'configured' ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                            ) : (
                                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                            )}
                            <div>
                                <h4 className={`text-sm font-medium ${status === 'configured' ? 'text-green-900' : 'text-amber-900'}`}>
                                    {status === 'configured' ? 'SSO is active and running' : 'Configuration Pending'}
                                </h4>
                                <p className={`text-sm mt-1 ${status === 'configured' ? 'text-green-700' : 'text-amber-700'}`}>
                                    {status === 'configured'
                                        ? 'Users can now log in using your Identity Provider.'
                                        : 'Please complete the setup below to activate SSO.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Protocol Selection */}
                    <div className="grid gap-4">
                        <label className="text-sm font-medium">Authentication Protocol</label>
                        <div className="flex items-center gap-4">
                            <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${protocol === 'saml' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-input hover:bg-muted/50'}`}>
                                <input type="radio" name="protocol" className="accent-primary" checked={protocol === 'saml'} onChange={() => setProtocol('saml')} />
                                <div>
                                    <div className="font-medium text-sm">SAML 2.0</div>
                                    <div className="text-xs text-muted-foreground">For Okta, OneLogin, Azure AD</div>
                                </div>
                            </label>
                            <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${protocol === 'oidc' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-input hover:bg-muted/50'}`}>
                                <input type="radio" name="protocol" className="accent-primary" checked={protocol === 'oidc'} onChange={() => setProtocol('oidc')} />
                                <div>
                                    <div className="font-medium text-sm">OIDC (OpenID Connect)</div>
                                    <div className="text-xs text-muted-foreground">Modern standard for auth</div>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Configuration Form */}
                    <div className="grid gap-6 p-6 border border-input rounded-lg bg-card">
                        <h4 className="font-medium text-sm">Identity Provider Configuration</h4>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Identity Provider Entity ID (Issuer)</label>
                            <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="https://idp.example.com/metadata" />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium">SSO URL (Single Sign-On Service)</label>
                            <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="https://idp.example.com/sso" />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Public Certificate (X.509)</label>
                            <textarea className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[120px] font-mono text-xs" placeholder="-----BEGIN CERTIFICATE-----..." />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            className="px-4 py-2 border border-input rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                            onClick={() => setSsoEnabled(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                            onClick={() => setStatus('configured')}
                        >
                            <RefreshCw className="h-4 w-4" />
                            Save & Test Connection
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-input">
                    <Lock className="h-10 w-10 mx-auto mb-4 opacity-20" />
                    <h3 className="text-lg font-medium text-foreground">SSO is Disabled</h3>
                    <p className="text-sm max-w-sm mx-auto mt-2">
                        Enable Single Sign-On to manage user access centrally through your Identity Provider.
                    </p>
                    <button
                        onClick={() => setSsoEnabled(true)}
                        className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md text-sm font-medium"
                    >
                        Enable SSO
                    </button>
                </div>
            )}
        </div>
    );
}
