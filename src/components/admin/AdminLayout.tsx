import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, LogOut, Settings, Globe, MessageCircle, Lock } from 'lucide-react';
import { Button } from '../ui/Button';

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const auth = localStorage.getItem('aclub_admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'aclub2025' || password === 'admin') {
      localStorage.setItem('aclub_admin_auth', 'true');
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Mot de passe incorrect');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('aclub_admin_auth');
    setIsAuthenticated(false);
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Catalogue', path: '/admin/products', icon: Package },
    { name: 'Scripts de Vente', path: '/admin/scripts', icon: MessageCircle },
    { name: 'Configuration', path: '/admin/settings', icon: Settings }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
        <Link to="/" className="mb-8 font-display text-4xl tracking-[0.1em] text-black">ACLUB</Link>
        <div className="bg-white p-8 rounded-xl border border-neutral-200 shadow-sm w-full max-w-sm">
          <div className="flex justify-center mb-6 text-brand-kaki">
            <Lock className="w-12 h-12" />
          </div>
          <h1 className="text-xl font-bold text-center text-black mb-6">Accès Administrateur</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black"
                autoFocus
              />
              {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
            </div>
            <Button type="submit" size="full" className="bg-black text-white hover:bg-neutral-800">
              Connexion
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Link to="/" className="text-sm font-medium text-neutral-500 hover:text-black">
              &larr; Retour au site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-neutral-200 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-neutral-200">
          <Link to="/" className="flex flex-col items-start group">
            <span className="font-display font-semibold text-lg tracking-tight leading-none text-black group-hover:text-brand-kaki transition-colors">AClub Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (location.pathname === '/admin/' && item.path === '/admin');
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-neutral-100 text-black' 
                    : 'text-neutral-500 hover:bg-neutral-50 hover:text-black'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-neutral-200 space-y-2">
          <Link to="/" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-neutral-500 hover:text-black transition-colors">
            <Globe className="w-4 h-4" />
            Voir le site
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors">
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-4 shrink-0">
          <span className="font-display font-semibold text-lg">AClub Admin</span>
          <button onClick={handleLogout} className="text-sm font-medium text-red-600">Déconnexion</button>
        </header>

        {/* Mobile Nav */}
        <nav className="md:hidden flex overflow-x-auto border-b border-neutral-200 bg-white shrink-0">
          {navItems.map((item) => {
             const isActive = location.pathname === item.path || (location.pathname === '/admin/' && item.path === '/admin');
             return (
               <Link
                 key={item.path}
                 to={item.path}
                 className={`px-4 py-3 text-xs font-semibold whitespace-nowrap ${isActive ? 'text-black border-b-2 border-black' : 'text-neutral-500'}`}
               >
                 {item.name}
               </Link>
             )
          })}
        </nav>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
