'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

interface Category {
  id: string
  name: string
}

interface AuctionData {
  id?: string
  title?: string
  description?: string
  category_id?: string
  starting_price?: number
  reserve_price?: number
  bid_increment?: number
  image_url?: string
  status?: string
  start_time?: string
  end_time?: string
}

export function AuctionForm({
  categories,
  auction,
}: {
  categories: Category[]
  auction?: AuctionData
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const isEditing = !!auction?.id

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category_id: formData.get('category_id') as string || null,
      starting_price: parseFloat(formData.get('starting_price') as string) || 0,
      current_price: parseFloat(formData.get('starting_price') as string) || 0,
      reserve_price: parseFloat(formData.get('reserve_price') as string) || null,
      bid_increment: parseFloat(formData.get('bid_increment') as string) || 100,
      image_url: formData.get('image_url') as string || null,
      status: formData.get('status') as string || 'draft',
      start_time: formData.get('start_time') ? new Date(formData.get('start_time') as string).toISOString() : null,
      end_time: formData.get('end_time') ? new Date(formData.get('end_time') as string).toISOString() : null,
      updated_at: new Date().toISOString(),
    }

    let result
    if (isEditing) {
      result = await supabase
        .from('auctions')
        .update(data)
        .eq('id', auction.id)
    } else {
      const { data: { user } } = await supabase.auth.getUser()
      result = await supabase
        .from('auctions')
        .insert({ ...data, created_by: user?.id })
    }

    if (result.error) {
      setError(result.error.message)
      setIsLoading(false)
      return
    }

    router.push('/admin/auctions')
    router.refresh()
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Titel *</Label>
            <Input
              id="title"
              name="title"
              defaultValue={auction?.title}
              placeholder="T.ex. Gustaviansk byrå 1780-tal"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Beskrivning</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={auction?.description || ''}
              placeholder="Beskriv objektet..."
              rows={4}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category_id">Kategori</Label>
              <Select name="category_id" defaultValue={auction?.category_id}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={auction?.status || 'draft'}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Utkast</SelectItem>
                  <SelectItem value="scheduled">Schemalagd</SelectItem>
                  <SelectItem value="active">Aktiv</SelectItem>
                  <SelectItem value="ended">Avslutad</SelectItem>
                  <SelectItem value="sold">Såld</SelectItem>
                  <SelectItem value="cancelled">Avbruten</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="starting_price">Utropspris (SEK) *</Label>
              <Input
                id="starting_price"
                name="starting_price"
                type="number"
                min="0"
                step="100"
                defaultValue={auction?.starting_price || 1000}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reserve_price">Acceptpris (SEK)</Label>
              <Input
                id="reserve_price"
                name="reserve_price"
                type="number"
                min="0"
                step="100"
                defaultValue={auction?.reserve_price || ''}
                placeholder="Valfritt"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bid_increment">Budsteg (SEK)</Label>
              <Input
                id="bid_increment"
                name="bid_increment"
                type="number"
                min="0"
                step="50"
                defaultValue={auction?.bid_increment || 100}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Bild-URL</Label>
            <Input
              id="image_url"
              name="image_url"
              type="url"
              defaultValue={auction?.image_url || ''}
              placeholder="https://..."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start_time">Starttid</Label>
              <Input
                id="start_time"
                name="start_time"
                type="datetime-local"
                defaultValue={auction?.start_time?.slice(0, 16)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_time">Sluttid</Label>
              <Input
                id="end_time"
                name="end_time"
                type="datetime-local"
                defaultValue={auction?.end_time?.slice(0, 16)}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Sparar...' : isEditing ? 'Uppdatera' : 'Skapa auktion'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Avbryt
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
