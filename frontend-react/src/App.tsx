/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { MainLayout } from './layout/MainLayout';
import { Dashboard } from './features/Dashboard';
import { EmployeesFeature } from './features/employees/EmployeesFeature';
import { VacationsFeature } from './features/vacations/VacationsFeature';
import { ContractsFeature } from './features/contracts/ContractsFeature';
import { PayrollFeature } from './features/payroll/PayrollFeature';
import { Login } from './features/auth/Login';
import { useAuthStore } from './store/useAuthStore';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  // Restore JWT session from localStorage on cold start
  React.useEffect(() => {
    useAuthStore.getState().restoreSession();
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="employees" element={<EmployeesFeature />} />
            <Route path="vacations" element={<VacationsFeature />} />
            <Route path="contracts" element={<ContractsFeature />} />
            <Route path="payroll" element={<PayrollFeature />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

