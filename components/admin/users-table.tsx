'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search, Shield, UserCheck, Eye, User } from 'lucide-react'

interface Profile {
  id: string
  email: string
  full_name: string | null
  role: string
  created_at: string
}

const roles = [
  { value: 'superadmin', label: 'Superadmin', icon: Shield, color: 'bg-red-100 text-red-800' },
  { value: 'admin', label: 'Admin', icon: UserCheck, color: 'bg-blue-100 text-blue-800' },
  { value: 'spectator', label: 'Betraktare', icon: Eye, color: 'bg-yellow-100 text-yellow-800' },
  { value: 'bidder', label: 'Budgivare', icon: User, color: 'bg-green-100 text-green-800' },
]

export function UsersTable({
  users,
  currentUserId,
  currentUserRole,
}: {
  users: Profile[]
  currentUserId: string
  currentUserRole: string
}) {
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  async function updateRole(userId: string, newRole: string) {
    if (userId === currentUserId) return
    if (currentUserRole !== 'superadmin' && newRole === 'superadmin') return
    if (currentUserRole !== 'superadmin' && users.find(u => u.id === userId)?.role === 'superadmin') return

    setUpdating(userId)
    
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq('id', userId)

    if (error) {
      console.error('Error updating role:', error)
    } else {
      router.refresh()
    }
    
    setUpdating(null)
  }

  const getRoleInfo = (role: string) => roles.find((r) => r.value === role) || roles[3]

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <CardTitle>Alla användare ({users.length})</CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Sök användare..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Användare</TableHead>
                <TableHead>E-post</TableHead>
                <TableHead>Roll</TableHead>
                <TableHead>Registrerad</TableHead>
                {currentUserRole === 'superadmin' && <TableHead>Ändra roll</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const roleInfo = getRoleInfo(user.role)
                const isCurrentUser = user.id === currentUserId
                const canEdit = currentUserRole === 'superadmin' && !isCurrentUser

                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {user.full_name || 'Ej angivet'}
                        {isCurrentUser && (
                          <Badge variant="outline" className="text-xs">Du</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge className={roleInfo.color}>
                        <roleInfo.icon className="h-3 w-3 mr-1" />
                        {roleInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString('sv-SE')}
                    </TableCell>
                    {currentUserRole === 'superadmin' && (
                      <TableCell>
                        {canEdit ? (
                          <Select
                            value={user.role}
                            onValueChange={(value) => updateRole(user.id, value)}
                            disabled={updating === user.id}
                          >
                            <SelectTrigger className="w-36">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem key={role.value} value={role.value}>
                                  <div className="flex items-center gap-2">
                                    <role.icon className="h-4 w-4" />
                                    {role.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                )
              })}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Inga användare hittades
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
