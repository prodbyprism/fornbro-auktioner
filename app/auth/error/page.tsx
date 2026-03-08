import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="font-serif text-2xl">Något gick fel</CardTitle>
          <CardDescription>
            Det uppstod ett problem med autentiseringen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Försök igen eller kontakta support om problemet kvarstår.
          </p>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button asChild variant="outline" className="flex-1">
            <Link href="/">Startsidan</Link>
          </Button>
          <Button asChild className="flex-1">
            <Link href="/auth/login">Logga in</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
