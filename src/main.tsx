import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import LandingPage from "./pages/LandingPage.tsx";
import SignInForm from "./auth/SignInForm.tsx";
import SignUpForm from "./auth/SignUpForm.tsx";
import VerifyEmailForm from "./auth/VerifyEmailForm.tsx";
import ForgotPasswordForm from "./auth/ForgotPasswordForm.tsx";
import AppLayout from "./layout/AppLayout.tsx";
import DashboardHome from "./pages/Dashboard/DashboardHome.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import ReportsPage from "./pages/ReportsPage.tsx";
import HelpPage from "./pages/HelpPage.tsx";
import DatabasePage from "./pages/DatabasePage.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<SignInForm />} />
            <Route path="/register" element={<SignUpForm />} />
            <Route path="/verify-email" element={<VerifyEmailForm />} />
            <Route path="/forgot-password" element={<ForgotPasswordForm />} />

            {/* Authenticated Routes */}
            <Route path="/dashboard" element={<AppLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="database" element={<DatabasePage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="help" element={<HelpPage />} />
            </Route>

            {/* Profile as top-level route */}
            <Route path="/profile" element={<AppLayout />}>
              <Route index element={<ProfilePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
