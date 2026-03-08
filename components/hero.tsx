import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>
      
      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-accent font-medium mb-6">
            Sedan 1987
          </p>
          
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[1.1]">
            <span className="block text-balance">Exklusiva föremål</span>
            <span className="block text-balance mt-2">möter klassisk elegans</span>
          </h1>
          
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Upptäck unika antikviteter, konstskatter och samlarobjekt från hela världen.
            Fornbro Auktioner är Sveriges ledande auktionshus för den kräsna samlaren.
          </p>
          
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-base">
              Utforska auktioner
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-6 text-base">
              Läs vår historia
            </Button>
          </div>
        </div>
        
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "12 000+", label: "Sålda objekt" },
            { value: "35+", label: "År i branschen" },
            { value: "8 500+", label: "Nöjda budgivare" },
            { value: "98%", label: "Kundnöjdhet" },
          ].map((stat, index) => (
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
