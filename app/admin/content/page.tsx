import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ContentEditor } from '@/components/admin/content-editor'

export default async function ContentPage() {
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

  const { data: content } = await supabase
    .from('site_content')
    .select('*')
    .order('key')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Innehåll</h1>
        <p className="text-muted-foreground mt-1">
          Redigera texter som visas på startsidan
        </p>
      </div>

      <ContentEditor content={content || []} />
    </div>
  )
}
