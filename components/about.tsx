import { Shield, Award, Users, History } from "lucide-react"
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
    .in('key', ['about_title', 'about_text1', 'about_text2'])
  
  const contentMap: Record<string, string> = {}
  data?.forEach((item: SiteContent) => {
    contentMap[item.key] = item.value
  })
  return contentMap
}

const features = [
  {
    icon: Shield,
    title: "Autenticitetsgaranti",
    description: "Alla objekt granskas av våra experter och levereras med äkthetsbevis.",
  },
  {
    icon: Award,
    title: "35 års erfarenhet",
    description: "Sedan 1987 har vi förmedlat kvalitetsföremål till samlare över hela världen.",
  },
  {
    icon: Users,
    title: "Personlig service",
    description: "Vårt team står alltid till tjänst med rådgivning och experthjälp.",
  },
  {
    icon: History,
    title: "Transparent budgivning",
    description: "Följ auktionerna i realtid med full insyn i budhistorik.",
  },
]

export async function About() {
  const content = await getContent()

  return (
    <section id="om-oss" className="py-24 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-primary-foreground/70 font-medium mb-2">
              Om Fornbro Auktioner
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight">
              {content.about_title || 'Tradition möter modern expertis'}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-primary-foreground/80">
              {content.about_text1 || 'Fornbro Auktioner grundades 1987 med visionen att göra antikviteter och konstskatter tillgängliga för en bredare publik. Idag är vi ett av Sveriges mest respekterade auktionshus med kunder från hela världen.'}
            </p>
            <p className="mt-4 text-lg leading-relaxed text-primary-foreground/80">
              {content.about_text2 || 'Vårt team av experter har decenniers erfarenhet inom sina respektive områden och garanterar att varje objekt vi förmedlar uppfyller högsta kvalitetskrav.'}
            </p>
            
            <div className="mt-10 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-full bg-primary-foreground/20 border-2 border-primary flex items-center justify-center"
                  >
                    <span className="text-sm font-medium">E{i}</span>
                  </div>
                ))}
              </div>
              <div>
                <p className="font-medium">Vårt expertteam</p>
                <p className="text-sm text-primary-foreground/70">12 specialister inom olika områden</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-lg bg-primary-foreground/5 border border-primary-foreground/10 hover:bg-primary-foreground/10 transition-colors"
              >
                <feature.icon className="h-8 w-8 mb-4 text-primary-foreground/80" />
                <h3 className="font-serif text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-primary-foreground/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
