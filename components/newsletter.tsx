"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, ArrowRight, Check } from "lucide-react"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
    }
  }
  
  return (
    <section className="py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-card border border-border p-8 md:p-12 lg:p-16">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-60 h-60 bg-accent/5 rounded-full blur-3xl" />
          
          <div className="relative grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
                <Mail className="h-4 w-4" />
                Nyhetsbrev
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-card-foreground">
                Missa aldrig en auktion
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Prenumerera på vårt nyhetsbrev och få exklusiv förhandsinformation 
                om kommande auktioner, nyheter från auktionshuset och tips från våra experter.
              </p>
              
              <ul className="mt-6 space-y-2">
                {[
                  "Förhandsvisning av kommande objekt",
                  "Expertartiklar om antikviteter",
                  "Inbjudningar till vernissager",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="lg:pl-8">
              {submitted ? (
                <div className="text-center p-8 rounded-lg bg-accent/10 border border-accent/20">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent text-accent-foreground mb-4">
                    <Check className="h-8 w-8" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-card-foreground">
                    Tack för din prenumeration!
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    Du kommer snart få ett bekräftelsemail.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-2">
                      E-postadress
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="din@epost.se"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                  <Button type="submit" className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90">
                    Prenumerera
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Genom att prenumerera godkänner du vår integritetspolicy. 
                    Du kan avsluta prenumerationen när som helst.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
