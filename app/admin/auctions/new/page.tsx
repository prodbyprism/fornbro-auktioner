import { createClient } from '@/lib/supabase/server'
import { AuctionForm } from '@/components/admin/auction-form'

export default async function NewAuctionPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name')

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Ny auktion</h1>
        <p className="text-muted-foreground mt-1">
          Skapa en ny auktion för försäljning
        </p>
      </div>

      <AuctionForm categories={categories || []} />
    </div>
  )
}
