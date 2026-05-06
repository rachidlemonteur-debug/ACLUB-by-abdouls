import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './store/AppContext';

// Layouts
import { StoreLayout } from './components/store/StoreLayout';
import { AdminLayout } from './components/admin/AdminLayout';

// Store Pages
import { HomePage } from './pages/store/HomePage';
import { ProductPage } from './pages/store/ProductPage';
import { CatalogPage } from './pages/store/CatalogPage';
import { AboutPage } from './pages/store/AboutPage';
import { NotFoundPage } from './pages/store/NotFoundPage';

// Admin Pages
import { Dashboard } from './pages/admin/Dashboard';
import { ProductsManager } from './pages/admin/ProductsManager';
import { CategoriesManager } from './pages/admin/CategoriesManager';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminScripts } from './pages/admin/AdminScripts';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminProtectedRoute } from './components/admin/AdminProtectedRoute';

import { Toaster } from '@/components/ui/sonner';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Store Routes */}
          <Route path="/" element={<StoreLayout />}>
            <Route index element={<HomePage />} />
            <Route path="catalogue" element={<CatalogPage />} />
            <Route path="a-propos" element={<AboutPage />} />
            <Route path="product/:slug" element={<ProductPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Admin auth */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<ProductsManager />} />
              <Route path="categories" element={<CategoriesManager />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="scripts" element={<AdminScripts />} />
            </Route>
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </AppProvider>
  );
}
