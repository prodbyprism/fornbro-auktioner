import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Eye, Edit } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const statusLabels: Record<string, { label: string; color: string }> = {
  draft: { label: 'Utkast', color: 'bg-gray-100 text-gray-800' },
  scheduled: { label: 'Schemalagd', color: 'bg-blue-100 text-blue-800' },
  active: { label: 'Aktiv', color: 'bg-green-100 text-green-800' },
  ended: { label: 'Avslutad', color: 'bg-red-100 text-red-800' },
  sold: { label: 'Såld', color: 'bg-purple-100 text-purple-800' },
  cancelled: { label: 'Avbruten', color: 'bg-yellow-100 text-yellow-800' },
}

export default async function AuctionsAdminPage() {
  const supabase = await createClient()

  const { data: auctions } = await supabase
    .from('auctions')
    .select('*, categories(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Auktioner</h1>
          <p className="text-muted-foreground mt-1">
            Hantera auktioner och objekt
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/auctions/new">
            <Plus className="h-4 w-4 mr-2" />
            Ny auktion
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alla auktioner ({auctions?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {auctions && auctions.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titel</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Utropspris</TableHead>
                    <TableHead>Aktuellt bud</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Åtgärder</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auctions.map((auction) => {
                    const status = statusLabels[auction.status] || statusLabels.draft
                    return (
                      <TableRow key={auction.id}>
                        <TableCell className="font-medium">{auction.title}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {auction.categories?.name || '-'}
                        </TableCell>
                        <TableCell>
                          {new Intl.NumberFormat('sv-SE', {
                            style: 'currency',
                            currency: 'SEK',
                            maximumFractionDigits: 0,
                          }).format(auction.starting_price)}
                        </TableCell>
                        <TableCell>
                          {new Intl.NumberFormat('sv-SE', {
                            style: 'currency',
                            currency: 'SEK',
                            maximumFractionDigits: 0,
                          }).format(auction.current_price)}
                        </TableCell>
                        <TableCell>
                          <Badge className={status.color}>{status.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button asChild variant="ghost" size="sm">
                              <Link href={`/auctions/${auction.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button asChild variant="ghost" size="sm">
                              <Link href={`/admin/auctions/${auction.id}`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Inga auktioner än</p>
              <Button asChild>
                <Link href="/admin/auctions/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Skapa din första auktion
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
