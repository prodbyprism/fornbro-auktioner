"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Gavel } from "lucide-react"

interface Auction {
  id: string
  title: string
  current_price: number
  starting_price: number
  end_time: string | null
  image_url: string | null
  bid_count: number
  status: string
  categories?: { name: string } | null
}

function formatTimeRemaining(endTime: string | null): string {
  if (!endTime) return "Ej schemalagd"
  
  const now = new Date()
  const end = new Date(endTime)
  const diff = end.getTime() - now.getTime()

  if (diff <= 0) return "Avslutad"

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (days > 0) return `${days}d ${hours}t kvar`
  if (hours > 0) return `${hours}t ${minutes}m kvar`
  return `${minutes}m kvar`
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    minimumFractionDigits: 0,
  }).format(amount)
}

export function AuctionCard({ auction }: { auction: Auction }) {
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTimeRemaining(formatTimeRemaining(auction.end_time))
    
    if (!auction.end_time) return
    
    const interval = setInterval(() => {
      setTimeRemaining(formatTimeRemaining(auction.end_time))
    }, 60000)
    return () => clearInterval(interval)
  }, [auction.end_time])

  const isEndingSoon = auction.end_time && 
    new Date(auction.end_time).getTime() - Date.now() < 24 * 60 * 60 * 1000 &&
    new Date(auction.end_time).getTime() > Date.now()

  const displayPrice = auction.current_price > 0 ? auction.current_price : auction.starting_price
  const categoryName = auction.categories?.name || "Övrigt"

  return (
    <Card className="group overflow-hidden border-border bg-card hover:shadow-lg transition-all duration-300">
      <Link href={`/auctions/${auction.id}`}>
        <div className="relative overflow-hidden aspect-[4/3]">
          {auction.image_url ? (
            <img
              src={auction.image_url}
              alt={auction.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Gavel className="h-12 w-12 text-muted-foreground/50" />
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge
              variant="secondary"
              className="bg-background/90 text-foreground backdrop-blur-sm"
            >
              {categoryName}
            </Badge>
          </div>
          {isEndingSoon && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-accent text-accent-foreground">
                Slutar snart
              </Badge>
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-5">
        <Link href={`/auctions/${auction.id}`}>
          <h3 className="font-serif text-lg font-semibold text-card-foreground line-clamp-2 group-hover:text-accent transition-colors">
            {auction.title}
          </h3>
        </Link>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {auction.bid_count > 0 ? "Nuvarande bud" : "Utropspris"}
            </p>
            <p className="font-serif text-xl font-bold text-card-foreground">
              {formatCurrency(displayPrice)}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{mounted ? timeRemaining : "..."}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {auction.bid_count} bud
            </p>
          </div>
        </div>

        <Button
          asChild
          className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Link href={`/auctions/${auction.id}`}>
            <Gavel className="h-4 w-4 mr-2" />
            {auction.status === "active" ? "Lägg bud" : "Visa objekt"}
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
