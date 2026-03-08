import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BidForm } from "@/components/bid-form"
import { Badge } from "@/components/ui/badge"
import { Clock, Gavel, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    minimumFractionDigits: 0,
  }).format(amount)
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("sv-SE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default async function AuctionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: auction } = await supabase
    .from("auctions")
    .select("*, categories(name)")
    .eq("id", id)
    .single()

  if (!auction) {
    notFound()
  }

  // Get bid history
  const { data: bids } = await supabase
    .from("bids")
    .select("*, profiles(full_name)")
    .eq("auction_id", id)
    .order("created_at", { ascending: false })
    .limit(10)

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const displayPrice =
    auction.current_price > 0 ? auction.current_price : auction.starting_price
  const minBid = displayPrice + (auction.bid_increment || 100)
  const isActive = auction.status === "active"
  const isEnded = auction.status === "ended" || auction.status === "sold"

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/auctions">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tillbaka till auktioner
            </Link>
          </Button>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image */}
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              {auction.image_url ? (
                <img
                  src={auction.image_url}
                  alt={auction.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Gavel className="h-24 w-24 text-muted-foreground/30" />
                </div>
              )}
              {isEnded && (
                <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                  <Badge className="text-lg px-4 py-2 bg-card text-foreground">
                    Avslutad
                  </Badge>
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                {auction.categories?.name && (
                  <Badge variant="secondary">{auction.categories.name}</Badge>
                )}
                <Badge
                  className={
                    isActive
                      ? "bg-green-100 text-green-800"
                      : isEnded
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                  }
                >
                  {isActive
                    ? "Pågående"
                    : isEnded
                      ? "Avslutad"
                      : auction.status}
                </Badge>
              </div>

              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                {auction.title}
              </h1>

              {auction.description && (
                <p className="text-muted-foreground mb-8 whitespace-pre-line">
                  {auction.description}
                </p>
              )}

              <div className="bg-card border border-border rounded-lg p-6 mb-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {auction.bid_count > 0 ? "Aktuellt bud" : "Utropspris"}
                    </p>
                    <p className="font-serif text-3xl font-bold text-foreground">
                      {formatCurrency(displayPrice)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Antal bud</p>
                    <p className="font-serif text-3xl font-bold text-foreground">
                      {auction.bid_count}
                    </p>
                  </div>
                </div>

                {auction.end_time && (
                  <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-5 w-5" />
                    <span>
                      {isEnded
                        ? `Avslutades ${formatDate(auction.end_time)}`
                        : `Avslutas ${formatDate(auction.end_time)}`}
                    </span>
                  </div>
                )}
              </div>

              {isActive && (
                <BidForm
                  auctionId={auction.id}
                  minBid={minBid}
                  bidIncrement={auction.bid_increment || 100}
                  isLoggedIn={!!user}
                />
              )}

              {/* Bid history */}
              {bids && bids.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-semibold text-lg mb-4">Budhistorik</h3>
                  <div className="space-y-2">
                    {bids.map((bid, index) => (
                      <div
                        key={bid.id}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          index === 0
                            ? "bg-accent/10 border border-accent/20"
                            : "bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {bid.profiles?.full_name || "Anonym"}
                          </span>
                          {index === 0 && (
                            <Badge className="bg-accent text-accent-foreground text-xs">
                              Högsta
                            </Badge>
                          )}
                        </div>
                        <span className="font-semibold">
                          {formatCurrency(bid.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
