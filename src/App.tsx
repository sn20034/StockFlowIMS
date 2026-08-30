import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./layouts/ProtectedRoute";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { VerifyEmail } from "./pages/VerifyEmail";
import { Dashboard } from "./pages/Dashboard";
import { Products } from "./pages/Products";
import { Categories } from "./pages/Categories";
import { Suppliers } from "./pages/Suppliers";
import { Transactions } from "./pages/Transactions";
import { Reports } from "./pages/Reports";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <Categories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/suppliers"
            element={
              <ProtectedRoute>
                <Suppliers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "8px",
              background: "#fff",
              color: "#111827",
              border: "1px solid #e5e7eb",
              fontSize: "14px",
            },
            success: { iconTheme: { primary: "#22c55e", secondary: "#fff" } },
            error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}
