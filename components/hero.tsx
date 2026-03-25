import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

type SiteContent = {
  key: string
  value: string
}

async function getContent() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('site_content')
    .select('key, value')
    .in('key', [
      'hero_eyebrow',
      'hero_title_line1', 
      'hero_title_line2',
      'hero_description',
      'hero_cta',
      'stat_1_value', 'stat_1_label',
      'stat_2_value', 'stat_2_label',
      'stat_3_value', 'stat_3_label',
      'stat_4_value', 'stat_4_label',
    ])
  
  const contentMap: Record<string, string> = {}
  data?.forEach((item: SiteContent) => {
    contentMap[item.key] = item.value
  })
  return contentMap
}

export async function Hero() {
  const content = await getContent()

  const stats = [
    { value: content.stat_1_value || '12 000+', label: content.stat_1_label || 'Sålda objekt' },
    { value: content.stat_2_value || '35+', label: content.stat_2_label || 'År i branschen' },
    { value: content.stat_3_value || '8 500+', label: content.stat_3_label || 'Nöjda budgivare' },
    { value: content.stat_4_value || '98%', label: content.stat_4_label || 'Kundnöjdhet' },
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>
      
      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-accent font-medium mb-6">
            {content.hero_eyebrow || 'Sedan 1987'}
          </p>
          
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[1.1]">
            <span className="block text-balance">{content.hero_title_line1 || 'Exklusiva föremål'}</span>
            <span className="block text-balance mt-2">{content.hero_title_line2 || 'möter klassisk elegans'}</span>
          </h1>
          
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {content.hero_description || 'Upptäck unika antikviteter, konstskatter och samlarobjekt från hela världen. Fornbro Auktioner är Sveriges ledande auktionshus för den kräsna samlaren.'}
          </p>
          
          <div className="mt-12 flex items-center justify-center">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-base">
              <a href="/auctions">
                {content.hero_cta || 'Utforska auktioner'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
        
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <p className="font-serif text-3xl md:text-4xl font-bold text-foreground">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
