import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { FeaturedAuctions } from "@/components/featured-auctions"
import { Categories } from "@/components/categories"
import { About } from "@/components/about"
import { HowItWorks } from "@/components/how-it-works"
import { Newsletter } from "@/components/newsletter"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <FeaturedAuctions />
      <Categories />
      <HowItWorks />
      <About />
      <Newsletter />
      <Footer />
    </main>
  )
}
