import { createClient } from "@/lib/supabase/server"
import { AuctionCard } from "@/components/auction-card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default async function AuctionsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from("auctions")
    .select("*, categories(name, slug)")
    .in("status", ["active", "scheduled"])
    .order("created_at", { ascending: false })

  if (category) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", category)
      .single()

    if (cat) {
      query = query.eq("category_id", cat.id)
    }
  }

  const { data: auctions } = await query

  // Get categories for filter
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name")

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="font-serif text-4xl font-bold text-foreground">
              Alla auktioner
            </h1>
            <p className="mt-2 text-muted-foreground">
              Bläddra bland våra aktuella auktioner
            </p>
          </div>

          {/* Category filters */}
          <div className="mb-8 flex flex-wrap gap-2">
            <a
              href="/auctions"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !category
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Alla
            </a>
            {categories?.map((cat) => (
              <a
                key={cat.id}
                href={`/auctions?category=${cat.slug}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === cat.slug
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat.name}
              </a>
            ))}
          </div>

          {auctions && auctions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {auctions.map((auction) => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card rounded-lg border border-border">
              <p className="text-muted-foreground mb-4">
                Inga auktioner hittades.
              </p>
              <p className="text-sm text-muted-foreground">
                {category
                  ? "Prova en annan kategori."
                  : "Kom tillbaka snart för nya objekt!"}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
