import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, LogOut, Settings, Globe, MessageCircle } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Catalogue', path: '/admin/products', icon: Package },
    { name: 'Catégories', path: '/admin/categories', icon: Package },
    { name: 'Scripts de Vente', path: '/admin/scripts', icon: MessageCircle },
    { name: 'Configuration', path: '/admin/settings', icon: Settings }
  ];

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
