import { createClient } from '@/lib/supabase/server'
import { CategoriesManager } from '@/components/admin/categories-manager'

export default async function CategoriesAdminPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Kategorier</h1>
        <p className="text-muted-foreground mt-1">
          Hantera auktionskategorier
        </p>
      </div>

      <CategoriesManager categories={categories || []} />
    </div>
  )
}
