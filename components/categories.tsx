import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

export async function Categories() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name")

  // Get auction counts for each category
  const categoriesWithCounts = await Promise.all(
    (categories || []).map(async (category) => {
      const { count } = await supabase
        .from("auctions")
        .select("*", { count: "exact", head: true })
        .eq("category_id", category.id)
        .in("status", ["active", "scheduled"])

      return { ...category, count: count || 0 }
    })
  )

  if (!categoriesWithCounts.length) {
    return null
  }

  return (
    <section id="kategorier" className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.2em] text-accent font-medium mb-2">
            Utforska
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
            Våra kategorier
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
            Från gustavianska möbler till samtida konst – upptäck vårt breda
            sortiment av noggrant utvalda antikviteter och samlarobjekt.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoriesWithCounts.map((category, index) => (
            <Link
              key={category.id}
              href={`/auctions?category=${category.slug}`}
              className={`group relative overflow-hidden rounded-lg bg-card border border-border ${
                index === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <div
                className={`relative ${
                  index === 0
                    ? "aspect-[16/9] md:aspect-square"
                    : "aspect-[16/9]"
                }`}
              >
                {category.image_url ? (
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-muted" />
                )}
                <div className="absolute inset-0 bg-foreground/40 group-hover:bg-foreground/50 transition-colors" />

                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3
                        className={`font-serif font-bold text-card ${
                          index === 0 ? "text-3xl md:text-4xl" : "text-2xl"
                        }`}
                      >
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-card/80 mt-1">
                          {category.description}
                        </p>
                      )}
                      <p className="text-card/60 text-sm mt-2">
                        {category.count} objekt
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-card/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-card/30 transition-colors">
                      <ArrowUpRight className="h-5 w-5 text-card" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
