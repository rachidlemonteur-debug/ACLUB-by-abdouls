import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner' 
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '../../lib/firebase'

export function AdminLogin() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/admin'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      localStorage.setItem('isAuthenticated', 'true')
      toast.success("Connexion réussie")
      navigate(from, { replace: true })
    } catch (error: any) {
      console.error(error)
      toast.error("Échec de la connexion. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-100 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">AClub by Abdouls</CardTitle>
          <CardDescription className="text-center">Connexion à l'espace administrateur</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="text-sm text-center text-neutral-600">
               Connectez-vous avec votre compte Google pour accéder au tableau de bord.
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Connexion en cours..." : "Se connecter avec Google"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
