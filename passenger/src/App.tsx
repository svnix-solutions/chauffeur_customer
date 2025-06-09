import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FrappeProvider } from 'frappe-react-sdk'
import { MainLayout } from '@/components/layout/MainLayout'
import { HomePage } from '@/pages/HomePage'
import ProfilePage from '@/pages/ProfilePage'
import SettingsPage from '@/pages/profile/SettingsPage'
import NotificationsPage from '@/pages/profile/NotificationsPage'
import PrivacyPage from '@/pages/profile/PrivacyPage'
import HelpPage from '@/pages/profile/HelpPage'
import LoginPage from '@/pages/auth/LoginPage'
import SignupPage from '@/pages/auth/SignupPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import BookingPage from '@/pages/booking/BookingPage'
import BookingSuccessPage from '@/pages/booking/BookingSuccessPage'
import ProtectedRoute from '@/components/ProtectedRoute'

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FrappeProvider>
        <Router basename="/passenger">
          <Routes>
            {/* Public routes without MainLayout */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected routes with MainLayout */}
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout>
                  <HomePage />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <MainLayout>
                  <ProfilePage />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/profile/settings" element={
              <ProtectedRoute>
                <MainLayout>
                  <SettingsPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/profile/notifications" element={
              <ProtectedRoute>
                <MainLayout>
                  <NotificationsPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/profile/privacy" element={
              <ProtectedRoute>
                <MainLayout>
                  <PrivacyPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/profile/help" element={
              <ProtectedRoute>
                <MainLayout>
                  <HelpPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/book" element={
              <ProtectedRoute>
                <MainLayout>
                  <BookingPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/bookings/:id" element={
              <ProtectedRoute>
                <MainLayout>
                  <BookingSuccessPage />
                </MainLayout>
              </ProtectedRoute>
            } />

            {/* Catch all route - 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </FrappeProvider>
    </QueryClientProvider>
  )
}

export default App
