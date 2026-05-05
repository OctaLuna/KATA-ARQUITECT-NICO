/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { MainLayout } from './layout/MainLayout';
import { Dashboard } from './features/Dashboard';
import { EmployeesFeature } from './features/employees/EmployeesFeature';
import { VacationsFeature } from './features/vacations/VacationsFeature';
import { ContractsFeature } from './features/contracts/ContractsFeature';
import { PayrollFeature } from './features/payroll/PayrollFeature';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
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

