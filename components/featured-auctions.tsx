import { createClient } from "@/lib/supabase/server"
import { AuctionCard } from "./auction-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export async function FeaturedAuctions() {
  const supabase = await createClient()

  const { data: auctions } = await supabase
    .from("auctions")
    .select("*, categories(name)")
    .in("status", ["active", "scheduled"])
    .order("created_at", { ascending: false })
    .limit(6)

  return (
    <section id="auktioner" className="py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-accent font-medium mb-2">
              Aktuella auktioner
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
              Utvalda objekt
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Bläddra bland våra noggrant utvalda antikviteter och konstföremål.
              Varje objekt är expertgranskat och autenticitetsgaranterat.
            </p>
          </div>
          <Button asChild variant="outline" className="shrink-0">
            <Link href="/auctions">
              Visa alla auktioner
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
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
              Inga aktiva auktioner just nu.
            </p>
            <p className="text-sm text-muted-foreground">
              Kom tillbaka snart för nya spännande objekt!
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
