import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ToastProvider } from './components/ui/Toast';
import { AppShell } from './components/layout/AppShell';
import { LoginPage } from './pages/LoginPage';
import { TotpLoginPage } from './pages/TotpLoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { BusinessesPage } from './pages/BusinessesPage';
import { BusinessDetailPage } from './pages/BusinessDetailPage';
import { RevenuePage } from './pages/RevenuePage';
import { UsersPage } from './pages/UsersPage';
import { SupportPage } from './pages/SupportPage';
import { SystemHealthPage } from './pages/SystemHealthPage';
import { AuditLogPage } from './pages/AuditLogPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminsPage } from './pages/AdminsPage';
import { ForbiddenPage } from './pages/ErrorPages';
import type { ReactNode } from 'react';

function RequireAuth({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const location = useLocation();
  if (!token) return <Navigate to="/login" state={{ from: location }} replace />;
  return <>{children}</>;
}

function RequirePermission({ permission, children }: { permission: string; children: ReactNode }) {
  const { hasPermission } = useAuth();
  if (!hasPermission(permission)) return <ForbiddenPage permission={permission} />;
  return <>{children}</>;
}

function ProtectedShell({ children }: { children: ReactNode }) {
  return (
    <RequireAuth>
      <AppShell>{children}</AppShell>
    </RequireAuth>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <ErrorBoundary>
            <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/login/totp" element={<TotpLoginPage />} />

            {/* Protected */}
            <Route path="/dashboard" element={
              <ProtectedShell>
                <RequirePermission permission="system.read">
                  <DashboardPage />
                </RequirePermission>
              </ProtectedShell>
            } />

            <Route path="/businesses" element={
              <ProtectedShell><BusinessesPage /></ProtectedShell>
            } />
            <Route path="/businesses/:id" element={
              <ProtectedShell><BusinessDetailPage /></ProtectedShell>
            } />

            <Route path="/revenue" element={
              <ProtectedShell>
                <RequirePermission permission="billing.read">
                  <RevenuePage />
                </RequirePermission>
              </ProtectedShell>
            } />

            <Route path="/subscriptions" element={
              <ProtectedShell>
                <RequirePermission permission="subscription.read">
                  <RevenuePage />
                </RequirePermission>
              </ProtectedShell>
            } />

            <Route path="/users" element={
              <ProtectedShell>
                <RequirePermission permission="user.read">
                  <UsersPage />
                </RequirePermission>
              </ProtectedShell>
            } />

            <Route path="/support" element={
              <ProtectedShell>
                <RequirePermission permission="support.read">
                  <SupportPage />
                </RequirePermission>
              </ProtectedShell>
            } />

            <Route path="/system-health" element={
              <ProtectedShell>
                <RequirePermission permission="system.read">
                  <SystemHealthPage />
                </RequirePermission>
              </ProtectedShell>
            } />

            <Route path="/audit-log" element={
              <ProtectedShell>
                <RequirePermission permission="system.read">
                  <AuditLogPage />
                </RequirePermission>
              </ProtectedShell>
            } />

            <Route path="/settings" element={
              <ProtectedShell><SettingsPage /></ProtectedShell>
            } />

            <Route path="/settings/admins" element={
              <ProtectedShell>
                <RequirePermission permission="system.write">
                  <AdminsPage />
                </RequirePermission>
              </ProtectedShell>
            } />

            {/* Redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          </ErrorBoundary>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
