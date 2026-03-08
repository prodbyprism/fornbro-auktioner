import Link from "next/link"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

const navigation = {
  auktioner: [
    { name: "Aktuella auktioner", href: "#" },
    { name: "Kommande auktioner", href: "#" },
    { name: "Avslutade auktioner", href: "#" },
    { name: "Sälja på auktion", href: "#" },
  ],
  kategorier: [
    { name: "Möbler", href: "#" },
    { name: "Konst", href: "#" },
    { name: "Silver & Guld", href: "#" },
    { name: "Porslin", href: "#" },
    { name: "Mattor", href: "#" },
  ],
  information: [
    { name: "Om oss", href: "#" },
    { name: "Så fungerar det", href: "#" },
    { name: "Villkor & Regler", href: "#" },
    { name: "Integritetspolicy", href: "#" },
    { name: "Vanliga frågor", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer id="kontakt" className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand & Contact */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <span className="font-serif text-3xl font-bold tracking-tight">
                Fornbro
              </span>
              <span className="block text-sm uppercase tracking-[0.3em] text-background/60">
                Auktioner
              </span>
            </Link>
            
            <p className="mt-6 text-background/70 leading-relaxed max-w-sm">
              Sveriges ledande auktionshus för antikviteter, konst och samlarobjekt 
              sedan 1987.
            </p>
            
            <div className="mt-8 space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="h-5 w-5 text-background/50 shrink-0 mt-0.5" />
                <span className="text-background/70">
                  Strandvägen 42, 114 56 Stockholm
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-5 w-5 text-background/50" />
                <span className="text-background/70">08-123 45 67</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-5 w-5 text-background/50" />
                <span className="text-background/70">info@fornbro.se</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Clock className="h-5 w-5 text-background/50 shrink-0 mt-0.5" />
                <span className="text-background/70">
                  Mån–Fre: 10–18<br />
                  Lör: 11–15
                </span>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Auktioner</h3>
            <ul className="mt-4 space-y-3">
              {navigation.auktioner.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-background/60 hover:text-background transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Kategorier</h3>
            <ul className="mt-4 space-y-3">
              {navigation.kategorier.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-background/60 hover:text-background transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Information</h3>
            <ul className="mt-4 space-y-3">
              {navigation.information.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-background/60 hover:text-background transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/50">
            © {new Date().getFullYear()} Fornbro Auktioner AB. Alla rättigheter förbehållna.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-background/50 hover:text-background transition-colors">
              Villkor
            </Link>
            <Link href="#" className="text-sm text-background/50 hover:text-background transition-colors">
              Integritet
            </Link>
            <Link href="#" className="text-sm text-background/50 hover:text-background transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
