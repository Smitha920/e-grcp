import React, { lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'
import AppLayout from '../components/layout/AppLayout'
import SessionExpired from '../pages/auth/SessionExpired'

// Lazy-loaded pages
const Login = lazy(() => import('../pages/auth/Login'))
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'))
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'))
const ProcurementList = lazy(() => import('../pages/procurement/ProcurementList'))
const ProcurementDetail = lazy(() => import('../pages/procurement/ProcurementDetail'))
const CreateRequest = lazy(() => import('../pages/procurement/CreateRequest'))
const VendorList = lazy(() => import('../pages/vendors/VendorList'))
const VendorProfile = lazy(() => import('../pages/vendors/VendorProfile'))
const RiskCenter = lazy(() => import('../pages/risk/RiskCenter'))
const ComplianceCenter = lazy(() => import('../pages/compliance/ComplianceCenter'))
const AuditCenter = lazy(() => import('../pages/audit/AuditCenter'))
const ApprovalWorkbench = lazy(() => import('../pages/approvals/ApprovalWorkbench'))
const NotificationCenter = lazy(() => import('../pages/notifications/NotificationCenter'))
const ReportingCenter = lazy(() => import('../pages/reports/ReportingCenter'))
const UserSettings = lazy(() => import('../pages/settings/UserSettings'))
const NotFound = lazy(() => import('../pages/NotFound'))

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Session Expired */}
      <Route path="/session-expired" element={<SessionExpired />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/procurement" element={<ProcurementList />} />
          <Route path="/procurement/new" element={<CreateRequest />} />
          <Route path="/procurement/:id" element={<ProcurementDetail />} />
          <Route path="/vendors" element={<VendorList />} />  
          <Route path="/vendors/:id" element={<VendorProfile />} />
          <Route path="/risk" element={<RiskCenter />} />
          <Route path="/compliance" element={<ComplianceCenter />} />
          <Route path="/audit" element={<AuditCenter />} />
          <Route path="/approvals" element={<ApprovalWorkbench />} />
          <Route path="/notifications" element={<NotificationCenter />} />
          <Route path="/reports" element={<ReportingCenter />} />
          <Route path="/settings" element={<UserSettings />} />
        </Route>
      </Route>

      {/* Redirects */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
