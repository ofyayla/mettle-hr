import { useState } from 'react';
import { Plus, MoreHorizontal, Shield, Users } from 'lucide-react';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Recruiter' | 'Hiring Manager';
    status: 'Active' | 'Inactive';
}

const mockUsers: User[] = [
    { id: '1', name: 'Alicia Koch', email: 'alicia@example.com', role: 'Admin', status: 'Active' },
    { id: '2', name: 'John Doe', email: 'john@example.com', role: 'Recruiter', status: 'Active' },
    { id: '3', name: 'Jane Smith', email: 'jane@example.com', role: 'Hiring Manager', status: 'Inactive' },
];

const initialPermissions = [
    {
        module: 'Jobs', permissions: [
            { name: 'View Jobs', admin: true, recruiter: true, hm: true },
            { name: 'Create Jobs', admin: true, recruiter: true, hm: false },
            { name: 'Delete Jobs', admin: true, recruiter: false, hm: false },
        ]
    },
    {
        module: 'Candidates', permissions: [
            { name: 'View Candidates', admin: true, recruiter: true, hm: true },
            { name: 'Move Candidates', admin: true, recruiter: true, hm: true },
            { name: 'Delete Candidates', admin: true, recruiter: false, hm: false },
        ]
    },
    {
        module: 'Settings', permissions: [
            { name: 'Manage Users', admin: true, recruiter: false, hm: false },
            { name: 'Billing', admin: true, recruiter: false, hm: false },
        ]
    }
];

export function UserManagementPage() {
    const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
    const [users] = useState<User[]>(mockUsers);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Team Management</h3>
                    <p className="text-sm text-muted-foreground">
                        Manage users, roles, and access permissions.
                    </p>
                </div>
                {activeTab === 'users' && (
                    <button
                        onClick={() => setIsInviteModalOpen(true)}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Invite User
                    </button>
                )}
            </div>

            <div className="border-b border-border">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`
                            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                            ${activeTab === 'users'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}
                        `}
                    >
                        <Users className="h-4 w-4" />
                        Users & Access
                    </button>
                    <button
                        onClick={() => setActiveTab('roles')}
                        className={`
                            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                            ${activeTab === 'roles'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}
                        `}
                    >
                        <Shield className="h-4 w-4" />
                        Roles & Permissions
                    </button>
                </nav>
            </div>

            {activeTab === 'users' ? (
                <div className="rounded-md border border-input">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground font-medium">
                            <tr>
                                <th className="h-12 px-4 align-middle">Name</th>
                                <th className="h-12 px-4 align-middle">Email</th>
                                <th className="h-12 px-4 align-middle">Role</th>
                                <th className="h-12 px-4 align-middle">Status</th>
                                <th className="h-12 px-4 align-middle text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b border-input last:border-0 hover:bg-muted/50 transition-colors">
                                    <td className="p-4 align-middle font-medium">{user.name}</td>
                                    <td className="p-4 align-middle">{user.email}</td>
                                    <td className="p-4 align-middle">
                                        <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-semibold text-foreground">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${user.status === 'Active'
                                                ? 'bg-green-50 text-green-700 ring-green-600/20'
                                                : 'bg-gray-50 text-gray-600 ring-gray-500/10'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <button className="h-8 w-8 hover:bg-accent hover:text-accent-foreground rounded-md inline-flex items-center justify-center">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="rounded-md border border-input overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground font-medium">
                                <tr>
                                    <th className="h-12 px-6 align-middle w-1/3">Permission</th>
                                    <th className="h-12 px-4 align-middle text-center w-1/6">Admin</th>
                                    <th className="h-12 px-4 align-middle text-center w-1/6">Recruiter</th>
                                    <th className="h-12 px-4 align-middle text-center w-1/6">Hiring Manager</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {initialPermissions.map((group) => (
                                    <>
                                        <tr key={group.module} className="bg-muted/30">
                                            <td colSpan={4} className="px-6 py-2 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                                                {group.module}
                                            </td>
                                        </tr>
                                        {group.permissions.map((perm) => (
                                            <tr key={perm.name} className="hover:bg-muted/50">
                                                <td className="px-6 py-4 font-medium">{perm.name}</td>
                                                <td className="px-4 py-4 text-center">
                                                    <input type="checkbox" checked={perm.admin} readOnly className="accent-primary h-4 w-4 rounded border-gray-300" />
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    <input type="checkbox" checked={perm.recruiter} readOnly className="accent-primary h-4 w-4 rounded border-gray-300" />
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    <input type="checkbox" checked={perm.hm} readOnly className="accent-primary h-4 w-4 rounded border-gray-300" />
                                                </td>
                                            </tr>
                                        ))}
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-end">
                        <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium">
                            Save Permissions
                        </button>
                    </div>
                </div>
            )}

            {isInviteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md rounded-lg bg-background border border-border p-6 shadow-lg">
                        <div className="mb-4">
                            <h3 className="text-lg font-medium">Invite User</h3>
                            <p className="text-sm text-muted-foreground">Invite a new member to your team.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Email</label>
                                <input placeholder="name@example.com" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Role</label>
                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                    <option>Recruiter</option>
                                    <option>Hiring Manager</option>
                                    <option>Admin</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <button
                                    onClick={() => setIsInviteModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                                >
                                    Cancel
                                </button>
                                <button className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                                    Send Invitation
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
