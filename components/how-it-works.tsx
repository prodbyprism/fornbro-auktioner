const steps = [
  {
    number: "01",
    title: "Registrera dig",
    description: "Skapa ett konto på några minuter för att kunna delta i våra auktioner och lägga bud.",
  },
  {
    number: "02",
    title: "Utforska auktioner",
    description: "Bläddra bland våra noggrant utvalda objekt. Alla föremål har detaljerade beskrivningar och bilder.",
  },
  {
    number: "03",
    title: "Lägg ditt bud",
    description: "Buda enkelt online eller via telefon. Följ auktionen i realtid och få notifieringar.",
  },
  {
    number: "04",
    title: "Vinn & Hämta",
    description: "Vinner du auktionen får du bekräftelse direkt. Välj mellan upphämtning eller hemleverans.",
  },
]

export function HowItWorks() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.2em] text-accent font-medium mb-2">
            Kom igång
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
            Så fungerar det
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
            Att delta i våra auktioner är enkelt. Följ dessa fyra steg för att 
            börja buda på exklusiva antikviteter och konstföremål.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-1/2 w-full h-px bg-border" />
              )}
              <div className="relative bg-card border border-border rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent text-accent-foreground font-serif text-xl font-bold mb-6">
                  {step.number}
                </div>
                <h3 className="font-serif text-xl font-semibold text-card-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
