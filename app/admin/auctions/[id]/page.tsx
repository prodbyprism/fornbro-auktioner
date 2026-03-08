import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { AuctionForm } from '@/components/admin/auction-form'

export default async function EditAuctionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: auction }, { data: categories }] = await Promise.all([
    supabase
      .from('auctions')
      .select('*')
      .eq('id', id)
      .single(),
    supabase
      .from('categories')
      .select('id, name')
      .order('name'),
  ])

  if (!auction) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Redigera auktion</h1>
        <p className="text-muted-foreground mt-1">{auction.title}</p>
      </div>

      <AuctionForm categories={categories || []} auction={auction} />
    </div>
  )
}
