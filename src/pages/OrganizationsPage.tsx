import { useEffect, useState } from 'react';
import { getOrganizations, getMembers, inviteMember, removeMember } from '../lib/userService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function OrganizationsPage() {
  const [orgs, setOrgs] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [members, setMembers] = useState([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');

  useEffect(() => {
    getOrganizations().then(r => setOrgs(r.data || []));
  }, []);

  const loadMembers = (orgId) => {
    setSelectedOrg(orgId);
    getMembers(orgId).then(r => setMembers(r.data?.members || []));
  };

  const handleInvite = () => {
    if (!selectedOrg || !inviteEmail) return;
    inviteMember(selectedOrg, { email: inviteEmail, role: inviteRole }).then(() => loadMembers(selectedOrg));
    setInviteEmail('');
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Organizations</h1>
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Your Organizations</h2>
        <ul className="space-y-2">
          {orgs.map((org: any) => (
            <li key={org._id}>
              <Button
                variant={selectedOrg === org._id ? 'gradient' : 'outline'}
                onClick={() => loadMembers(org._id)}
              >
                {org.name}
              </Button>
            </li>
          ))}
        </ul>
      </div>
      {selectedOrg && (
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Manage team, invite, and set roles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex gap-2">
              <Input
                placeholder="Invite email"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
              />
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleInvite}>Invite</Button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Role</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m: any) => (
                  <tr key={m.id} className="border-b">
                    <td className="p-2">{m.firstName} {m.lastName}</td>
                    <td className="p-2">{m.email}</td>
                    <td className="p-2"><Badge>{m.role}</Badge></td>
                    <td className="p-2">{m.status}</td>
                    <td className="p-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeMember(selectedOrg, m.id).then(() => loadMembers(selectedOrg))}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
