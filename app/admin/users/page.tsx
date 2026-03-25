import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { UsersTable } from '@/components/admin/users-table'
import { InviteUserDialog } from '@/components/admin/invite-user'

export default async function UsersPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!currentProfile || !['superadmin', 'admin'].includes(currentProfile.role)) {
    redirect('/admin')
  }

  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold">Användare</h1>
          <p className="text-muted-foreground mt-1">
            Hantera användare och deras roller
          </p>
        </div>
        {currentProfile.role === 'superadmin' && <InviteUserDialog />}
      </div>

      <UsersTable 
        users={users || []} 
        currentUserId={user.id}
        currentUserRole={currentProfile.role}
      />
    </div>
  )
}
