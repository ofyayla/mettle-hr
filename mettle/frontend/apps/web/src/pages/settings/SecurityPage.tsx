import { useState } from 'react';
import { Shield, FileText } from 'lucide-react';

const mockAuditLogs = [
    { id: 1, action: 'User Login', user: 'alicia@example.com', ip: '192.168.1.1', timestamp: '2 mins ago' },
    { id: 2, action: 'Export Candidates', user: 'john@example.com', ip: '10.0.0.5', timestamp: '1 hour ago' },
    { id: 3, action: 'Role Update', user: 'admin@mettle.com', ip: '172.16.0.1', timestamp: '3 hours ago' },
    { id: 4, action: 'Failed Login Attempt', user: 'unknown', ip: '45.32.11.2', timestamp: '5 hours ago', status: 'Failed' },
];

export function SecurityPage() {
    const [auditLogs] = useState(mockAuditLogs);
    return (
        <div className="space-y-6">

            {/* Audit Logs Section */}
            <div>
                <div className="mb-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Audit Logs
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Recent security events and system activities.
                    </p>
                </div>

                <div className="rounded-md border border-input bg-card">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground font-medium">
                            <tr>
                                <th className="h-10 px-4 align-middle">Action</th>
                                <th className="h-10 px-4 align-middle">User</th>
                                <th className="h-10 px-4 align-middle">IP Address</th>
                                <th className="h-10 px-4 align-middle">Time</th>
                                <th className="h-10 px-4 align-middle">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {auditLogs.map((log) => (
                                <tr key={log.id} className="border-b border-input last:border-0 hover:bg-muted/50">
                                    <td className="p-4 align-middle font-medium">{log.action}</td>
                                    <td className="p-4 align-middle">{log.user}</td>
                                    <td className="p-4 align-middle font-mono text-xs">{log.ip}</td>
                                    <td className="p-4 align-middle text-muted-foreground">{log.timestamp}</td>
                                    <td className="p-4 align-middle">
                                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${log.status === 'Failed'
                                            ? 'bg-red-100 text-red-700'
                                            : 'bg-green-100 text-green-700'
                                            }`}>
                                            {log.status === 'Failed' ? 'Failed' : 'Success'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
