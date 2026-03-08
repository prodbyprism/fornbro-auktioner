"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Gavel } from "lucide-react"
import Link from "next/link"

interface BidFormProps {
  auctionId: string
  minBid: number
  bidIncrement: number
  isLoggedIn: boolean
}

export function BidForm({
  auctionId,
  minBid,
  bidIncrement,
  isLoggedIn,
}: BidFormProps) {
  const [amount, setAmount] = useState(minBid.toString())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    const bidAmount = parseFloat(amount)

    if (isNaN(bidAmount) || bidAmount < minBid) {
      setError(
        `Minsta bud är ${new Intl.NumberFormat("sv-SE").format(minBid)} kr`
      )
      setIsLoading(false)
      return
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError("Du måste vara inloggad för att lägga bud")
      setIsLoading(false)
      return
    }

    // Insert bid
    const { error: bidError } = await supabase.from("bids").insert({
      auction_id: auctionId,
      user_id: user.id,
      amount: bidAmount,
    })

    if (bidError) {
      setError(bidError.message)
      setIsLoading(false)
      return
    }

    // Update auction current price and bid count
    await supabase
      .from("auctions")
      .update({
        current_price: bidAmount,
        bid_count: supabase.rpc ? undefined : undefined, // We'll handle this with a trigger ideally
        updated_at: new Date().toISOString(),
      })
      .eq("id", auctionId)

    // Also increment bid count
    const { data: auction } = await supabase
      .from("auctions")
      .select("bid_count")
      .eq("id", auctionId)
      .single()

    await supabase
      .from("auctions")
      .update({
        current_price: bidAmount,
        bid_count: (auction?.bid_count || 0) + 1,
      })
      .eq("id", auctionId)

    setSuccess(true)
    setAmount((bidAmount + bidIncrement).toString())
    setIsLoading(false)
    router.refresh()
  }

  if (!isLoggedIn) {
    return (
      <Card className="border-accent/30 bg-accent/5">
        <CardContent className="pt-6">
          <p className="text-center mb-4 text-muted-foreground">
            Du måste vara inloggad för att lägga bud
          </p>
          <div className="flex gap-2 justify-center">
            <Button asChild variant="outline">
              <Link href={`/auth/login?redirect=/auctions/${auctionId}`}>
                Logga in
              </Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Registrera dig</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 text-sm text-green-700 bg-green-50 rounded-md">
              <Gavel className="h-4 w-4" />
              Ditt bud har lagts!
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="amount">Ditt bud (SEK)</Label>
            <Input
              id="amount"
              type="number"
              min={minBid}
              step={bidIncrement}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg font-semibold"
            />
            <p className="text-xs text-muted-foreground">
              Minsta bud:{" "}
              {new Intl.NumberFormat("sv-SE", {
                style: "currency",
                currency: "SEK",
                maximumFractionDigits: 0,
              }).format(minBid)}
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              "Lägger bud..."
            ) : (
              <>
                <Gavel className="h-5 w-5 mr-2" />
                Lägg bud
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
