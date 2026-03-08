import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MailCheck } from 'lucide-react'

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <MailCheck className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="font-serif text-2xl">Bekräfta din e-post</CardTitle>
          <CardDescription>
            Vi har skickat ett bekräftelsemail till din e-postadress.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Klicka på länken i mailet för att aktivera ditt konto och börja buda på auktioner.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Tillbaka till startsidan</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
