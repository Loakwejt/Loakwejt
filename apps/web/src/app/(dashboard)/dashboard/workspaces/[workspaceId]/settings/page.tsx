import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Separator,
  Alert,
  AlertDescription,
} from '@builderly/ui';
import { 
  Settings, 
  Users, 
  Shield, 
  Trash2, 
  UserPlus, 
  Mail, 
  Crown,
  MoreVertical,
  Building,
  Link as LinkIcon,
  Globe,
  AlertTriangle
} from 'lucide-react';
import { WorkspaceSocialLinks } from '@/components/dashboard/workspace-social-links';

interface WorkspaceSettingsPageProps {
  params: { workspaceId: string };
}

export default async function WorkspaceSettingsPage({ params }: WorkspaceSettingsPageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  const membership = await prisma.workspaceMember.findFirst({
    where: {
      workspaceId: params.workspaceId,
      userId: session.user.id,
    },
    include: {
      workspace: {
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      },
    },
  });

  if (!membership) {
    redirect('/dashboard');
  }

  const workspace = membership.workspace;
  const isOwnerOrAdmin = membership.role === 'OWNER' || membership.role === 'ADMIN';

  const roleColors: Record<string, string> = {
    OWNER: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    ADMIN: 'bg-blue-100 text-blue-800 border-blue-300',
    EDITOR: 'bg-green-100 text-green-800 border-green-300',
    VIEWER: 'bg-gray-100 text-gray-800 border-gray-300',
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Workspace Settings</h1>
        <p className="text-muted-foreground">
          Manage settings for {workspace.name}
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Members
          </TabsTrigger>
          {isOwnerOrAdmin && (
            <TabsTrigger value="danger" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Danger Zone
            </TabsTrigger>
          )}
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workspace Details</CardTitle>
              <CardDescription>
                Basic information about your workspace
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Workspace Name</Label>
                  <Input 
                    id="name" 
                    defaultValue={workspace.name} 
                    disabled={!isOwnerOrAdmin}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">builderly.io/</span>
                    <Input 
                      id="slug" 
                      defaultValue={workspace.slug} 
                      disabled={!isOwnerOrAdmin}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  defaultValue={workspace.description || ''} 
                  placeholder="Describe your workspace"
                  disabled={!isOwnerOrAdmin}
                />
              </div>
              {isOwnerOrAdmin && (
                <div className="flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Workspace Plan</CardTitle>
              <CardDescription>
                Dein aktueller Abo-Plan
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Crown className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-lg">
                    {workspace.plan === 'FREE' ? 'Starter' : workspace.plan === 'ENTERPRISE' ? 'Enterprise' : workspace.plan === 'BUSINESS' ? 'Business' : 'Pro'} Plan
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {workspace.plan === 'FREE' 
                      ? 'Basis-Features zum Ausprobieren'
                      : workspace.plan === 'PRO'
                      ? 'Erweiterte Features für Freelancer & kleine Projekte'
                      : workspace.plan === 'BUSINESS'
                      ? 'Professionelle Features für Teams & Unternehmen'
                      : 'Enterprise-Features für Agenturen & große Organisationen'}
                  </p>
                </div>
              </div>
              {isOwnerOrAdmin && workspace.plan === 'FREE' && (
                <Button>Plan upgraden</Button>
              )}
            </CardContent>
          </Card>

          {/* Social Media Links */}
          <WorkspaceSocialLinks
            workspaceId={workspace.id}
            initialLinks={
              Array.isArray((workspace as any).socialLinks)
                ? (workspace as any).socialLinks
                : []
            }
            isEditable={isOwnerOrAdmin}
          />
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-6">
          {isOwnerOrAdmin && (
            <Card>
              <CardHeader>
                <CardTitle>Invite Team Members</CardTitle>
                <CardDescription>
                  Add new members to your workspace
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input 
                      placeholder="Enter email address" 
                      type="email"
                    />
                  </div>
                  <select className="px-3 py-2 border rounded-md bg-background">
                    <option value="VIEWER">Viewer</option>
                    <option value="EDITOR">Editor</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                {workspace.members.length} member{workspace.members.length !== 1 ? 's' : ''} in this workspace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workspace.members.map((member) => {
                  const initials = member.user.name
                    ? member.user.name.split(' ').map(n => n[0]).join('').toUpperCase()
                    : member.user.email?.[0]?.toUpperCase() || 'U';
                  
                  return (
                    <div 
                      key={member.id} 
                      className="flex items-center justify-between py-3 border-b last:border-0"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={member.user.image || ''} />
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium flex items-center gap-2">
                            {member.user.name || 'Unnamed User'}
                            {member.userId === session.user.id && (
                              <Badge variant="outline" className="text-xs">You</Badge>
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {member.user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={roleColors[member.role]}>
                          {member.role === 'OWNER' && <Crown className="h-3 w-3 mr-1" />}
                          {member.role}
                        </Badge>
                        {isOwnerOrAdmin && member.role !== 'OWNER' && member.userId !== session.user.id && (
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Danger Zone */}
        {isOwnerOrAdmin && (
          <TabsContent value="danger" className="space-y-6">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Actions in this section are destructive and cannot be undone.
              </AlertDescription>
            </Alert>

            {membership.role !== 'OWNER' && (
              <Card className="border-destructive/50">
                <CardHeader>
                  <CardTitle className="text-destructive">Leave Workspace</CardTitle>
                  <CardDescription>
                    Remove yourself from this workspace
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    You will lose access to all sites and resources in this workspace.
                  </p>
                  <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-white">
                    Leave Workspace
                  </Button>
                </CardContent>
              </Card>
            )}

            {membership.role === 'OWNER' && (
              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="text-destructive">Delete Workspace</CardTitle>
                  <CardDescription>
                    Permanently delete this workspace and all its data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    This will permanently delete:
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>All sites and pages</li>
                    <li>All uploaded assets</li>
                    <li>All collections and records</li>
                    <li>All team member access</li>
                  </ul>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Type <strong>{workspace.name}</strong> to confirm</Label>
                    <Input placeholder="Enter workspace name" />
                  </div>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Workspace
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
