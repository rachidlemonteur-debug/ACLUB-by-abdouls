import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner' 

export function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/admin'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Le simple contrôle via l'authentification (hardcoded pour le moment)
    setTimeout(() => {
      if (email === 'admin@aclub.com' && password === 'admin123') {
        localStorage.setItem('isAuthenticated', 'true');
        toast.success("Connexion réussie")
        navigate(from, { replace: true })
      } else {
        toast.error("Identifiants incorrects (Essayez admin@aclub.com / admin123)")
      }
      setLoading(false)
    }, 500);
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
             <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs p-3 rounded-md mb-4 font-medium">
               Utilisez <b>admin@aclub.com</b> et <b>admin123</b> pour vous connecter.
             </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@aclub.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
