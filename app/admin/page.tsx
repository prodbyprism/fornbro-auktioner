import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Gavel, Users, FolderOpen, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch statistics
  const [
    { count: auctionCount },
    { count: userCount },
    { count: categoryCount },
    { count: bidCount },
  ] = await Promise.all([
    supabase.from('auctions').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('bids').select('*', { count: 'exact', head: true }),
  ])

  // Fetch recent auctions
  const { data: recentAuctions } = await supabase
    .from('auctions')
    .select('*, categories(name)')
    .order('created_at', { ascending: false })
    .limit(5)

  const stats = [
    { name: 'Auktioner', value: auctionCount || 0, icon: Gavel, href: '/admin/auctions' },
    { name: 'Användare', value: userCount || 0, icon: Users, href: '/admin/users' },
    { name: 'Kategorier', value: categoryCount || 0, icon: FolderOpen, href: '/admin/categories' },
    { name: 'Totala bud', value: bidCount || 0, icon: TrendingUp, href: '/admin/stats' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Välkommen till administratörspanelen</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.name} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.name}
                </CardTitle>
                <stat.icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Senaste auktioner</CardTitle>
            <CardDescription>De senast skapade auktionerna</CardDescription>
          </CardHeader>
          <CardContent>
            {recentAuctions && recentAuctions.length > 0 ? (
              <div className="space-y-4">
                {recentAuctions.map((auction) => (
                  <Link
                    key={auction.id}
                    href={`/admin/auctions/${auction.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{auction.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {auction.categories?.name || 'Ingen kategori'}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      auction.status === 'active' ? 'bg-green-100 text-green-800' :
                      auction.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                      auction.status === 'ended' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {auction.status === 'active' ? 'Aktiv' :
                       auction.status === 'draft' ? 'Utkast' :
                       auction.status === 'ended' ? 'Avslutad' :
                       auction.status}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Inga auktioner än. Skapa din första auktion!
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Snabbåtgärder</CardTitle>
            <CardDescription>Vanliga administrativa uppgifter</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/admin/auctions/new"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <Gavel className="h-5 w-5 text-primary" />
              <span>Skapa ny auktion</span>
            </Link>
            <Link
              href="/admin/categories"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <FolderOpen className="h-5 w-5 text-primary" />
              <span>Hantera kategorier</span>
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <Users className="h-5 w-5 text-primary" />
              <span>Hantera användare</span>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
