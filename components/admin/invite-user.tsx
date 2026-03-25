'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UserPlus, Loader2, Shield, UserCheck, Eye, User } from 'lucide-react'

const roles = [
  { value: 'bidder', label: 'Budgivare', icon: User, description: 'Kan lägga bud på auktioner' },
  { value: 'spectator', label: 'Betraktare', icon: Eye, description: 'Kan se admin-panelen men inte göra ändringar' },
  { value: 'admin', label: 'Admin', icon: UserCheck, description: 'Kan hantera auktioner och kategorier' },
  { value: 'superadmin', label: 'Superadmin', icon: Shield, description: 'Full kontroll över systemet' },
]

export function InviteUserDialog() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('bidder')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleInvite() {
    if (!email) {
      setError('E-postadress krävs')
      return
    }

    setLoading(true)
    setError(null)

    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12).toUpperCase()

    // Create user via Supabase Auth
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password: tempPassword,
      options: {
        data: {
          full_name: fullName,
          invited_role: role,
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // Update the profile with the correct role (the trigger creates with 'bidder' by default)
    if (data.user) {
      // Wait a bit for the trigger to create the profile
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          role, 
          full_name: fullName,
          updated_at: new Date().toISOString() 
        })
        .eq('id', data.user.id)

      if (updateError) {
        console.error('Error updating role:', updateError)
      }
    }

    setSuccess(true)
    setLoading(false)
    router.refresh()

    // Reset form after a delay
    setTimeout(() => {
      setOpen(false)
      setEmail('')
      setFullName('')
      setRole('bidder')
      setSuccess(false)
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Bjud in användare
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bjud in ny användare</DialogTitle>
          <DialogDescription>
            Skapa ett konto för en ny användare. De kommer få ett e-postmeddelande för att bekräfta kontot.
          </DialogDescription>
        </DialogHeader>
        
        {success ? (
          <div className="py-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <UserPlus className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-sm text-muted-foreground">
              Användaren har bjudits in! De kommer få ett bekräftelsemail.
            </p>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-postadress</Label>
              <Input
                id="email"
                type="email"
                placeholder="anvandare@exempel.se"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fullName">Namn</Label>
              <Input
                id="fullName"
                placeholder="Förnamn Efternamn"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Roll</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      <div className="flex items-center gap-2">
                        <r.icon className="h-4 w-4" />
                        <span>{r.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {roles.find(r => r.value === role)?.description}
              </p>
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>
        )}

        {!success && (
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Avbryt
            </Button>
            <Button onClick={handleInvite} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Bjuder in...
                </>
              ) : (
                'Bjud in'
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
