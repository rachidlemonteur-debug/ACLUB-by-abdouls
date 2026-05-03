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
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminScripts } from './pages/admin/AdminScripts';

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

          {/* Admin Routes */}
          <Route path="admin/*" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductsManager />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="scripts" element={<AdminScripts />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}
