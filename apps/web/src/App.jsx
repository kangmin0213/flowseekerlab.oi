import React, { useEffect } from 'react';
import { Route, Routes, BrowserRouter as Router, Navigate, useLocation } from 'react-router-dom';

// Contexts
import { DarkModeProvider } from '@/contexts/DarkModeContext.jsx';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import { LanguageProvider } from '@/contexts/LanguageContext.jsx';

// Components
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import ScrollToTop from '@/components/ScrollToTop.jsx';

// Public Pages
import HomePage from '@/pages/HomePage.jsx';
import BlogDetailPage from '@/pages/BlogDetailPage.jsx';
import BlogListPage from '@/pages/BlogListPage.jsx';
import SearchPage from '@/pages/SearchPage.jsx';
import NotFoundPage from '@/pages/NotFoundPage.jsx';

// Admin Pages
import LoginPage from '@/pages/admin/LoginPage.jsx';
import DashboardPage from '@/pages/admin/DashboardPage.jsx';
import PostsListPage from '@/pages/admin/PostsListPage.jsx';
import PostEditorPage from '@/pages/admin/PostEditorPage.jsx';
import CategoriesPage from '@/pages/admin/CategoriesPage.jsx';
import TagsPage from '@/pages/admin/TagsPage.jsx';
import CommentsPage from '@/pages/admin/CommentsPage.jsx';
import MediaPage from '@/pages/admin/MediaPage.jsx';
import UsersPage from '@/pages/admin/UsersPage.jsx';
import SettingsPage from '@/pages/admin/SettingsPage.jsx';

const RouteLogger = ({ name, children }) => {
  const location = useLocation();
  useEffect(() => {
    console.log(`Matched route: ${name} for path: ${location.pathname}`);
  }, [name, location.pathname]);
  return children;
};

function App() {
  return (
    <DarkModeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <ScrollToTop />
            <Routes>
              {/* Admin */}
              <Route path="/admin" element={<RouteLogger name="/admin (LoginPage)"><LoginPage /></RouteLogger>} />
              <Route path="/admin/login" element={<Navigate to="/admin" replace />} />

              <Route path="/admin/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/admin/posts" element={<ProtectedRoute><PostsListPage /></ProtectedRoute>} />
              <Route path="/admin/posts/new" element={<ProtectedRoute><PostEditorPage /></ProtectedRoute>} />
              <Route path="/admin/posts/edit/:id" element={<ProtectedRoute><PostEditorPage /></ProtectedRoute>} />
              <Route path="/admin/categories" element={<ProtectedRoute requireAdmin><CategoriesPage /></ProtectedRoute>} />
              <Route path="/admin/tags" element={<ProtectedRoute requireAdmin><TagsPage /></ProtectedRoute>} />
              <Route path="/admin/comments" element={<ProtectedRoute><CommentsPage /></ProtectedRoute>} />
              <Route path="/admin/media" element={<ProtectedRoute><MediaPage /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute requireAdmin><UsersPage /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute requireAdmin><SettingsPage /></ProtectedRoute>} />

              {/* Public */}
              <Route path="/" element={<HomePage />} />
              <Route path="/blog" element={<BlogListPage />} />
              <Route path="/blog/:slug" element={<BlogDetailPage />} />
              <Route path="/category/:categorySlug" element={<BlogListPage />} />
              <Route path="/search" element={<SearchPage />} />

              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </DarkModeProvider>
  );
}

export default App;
