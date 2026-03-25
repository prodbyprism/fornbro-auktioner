'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Save, Loader2 } from 'lucide-react'

interface ContentItem {
  key: string
  value: string
  label: string
  type: 'text' | 'textarea'
}

const sections = [
  {
    title: 'Hero-sektion',
    description: 'Huvudrubrik och introduktionstext på startsidan',
    keys: ['hero_eyebrow', 'hero_title_line1', 'hero_title_line2', 'hero_description', 'hero_cta'],
  },
  {
    title: 'Statistik',
    description: 'Siffror som visas under hero-sektionen',
    keys: ['stat_1_value', 'stat_1_label', 'stat_2_value', 'stat_2_label', 'stat_3_value', 'stat_3_label', 'stat_4_value', 'stat_4_label'],
  },
  {
    title: 'Om oss',
    description: 'Information om Fornbro Auktioner',
    keys: ['about_title', 'about_text1', 'about_text2'],
  },
  {
    title: 'Nyhetsbrev',
    description: 'Text för nyhetsbrev-sektionen',
    keys: ['newsletter_title', 'newsletter_description'],
  },
]

export function ContentEditor({ content }: { content: ContentItem[] }) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {}
    content.forEach((item) => {
      map[item.key] = item.value
    })
    return map
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const contentMap = content.reduce((acc, item) => {
    acc[item.key] = item
    return acc
  }, {} as Record<string, ContentItem>)

  async function handleSave() {
    setSaving(true)
    setSaved(false)

    const updates = Object.entries(values).map(([key, value]) => ({
      key,
      value,
      label: contentMap[key]?.label || key,
      type: contentMap[key]?.type || 'text',
      updated_at: new Date().toISOString(),
    }))

    for (const update of updates) {
      await supabase
        .from('site_content')
        .upsert(update, { onConflict: 'key' })
    }

    setSaving(false)
    setSaved(true)
    router.refresh()
    
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <Card key={section.title}>
          <CardHeader>
            <CardTitle>{section.title}</CardTitle>
            <CardDescription>{section.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {section.keys.map((key) => {
              const item = contentMap[key]
              if (!item) return null

              return (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key}>{item.label}</Label>
                  {item.type === 'textarea' ? (
                    <Textarea
                      id={key}
                      value={values[key] || ''}
                      onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                      rows={3}
                    />
                  ) : (
                    <Input
                      id={key}
                      value={values[key] || ''}
                      onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                    />
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>
      ))}

      <div className="flex items-center gap-4">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sparar...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Spara ändringar
            </>
          )}
        </Button>
        {saved && (
          <span className="text-sm text-green-600">Ändringarna har sparats!</span>
        )}
      </div>
    </div>
  )
}
