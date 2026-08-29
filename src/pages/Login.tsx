import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Boxes,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Package,
  AlertTriangle,
} from "lucide-react";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/helpers";

const BrandingSection = () => {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-800 to-primary-950">
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -left-24 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl" />

      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 py-12 w-full">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Boxes className="text-white" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                StockFlow IMS
              </h2>
              <p className="text-primary-200 text-sm">
                Inventory Management System
              </p>
            </div>
          </div>
          <h1 className="text-3xl xl:text-4xl font-bold text-white leading-tight max-w-md">
            Manage your inventory. <br />
            Track your stock. <br />
            <span className="text-accent-300">Grow your business.</span>
          </h1>
        </div>

        <div className="space-y-4 max-w-md">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-primary-200 text-xs font-medium">
                  Total Stock Value
                </p>
                <p className="text-white text-2xl font-bold mt-1">$48,920.50</p>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-success-500/20">
                <TrendingUp className="text-success-300" size={14} />
                <span className="text-success-300 text-xs font-semibold">
                  +12.5%
                </span>
              </div>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-primary-200">In Stock</span>
                <div className="flex items-center gap-2 flex-1 max-w-[140px] ml-4">
                  <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-success-400 rounded-full"
                      style={{ width: "78%" }}
                    />
                  </div>
                  <span className="text-white font-medium text-xs w-8 text-right">
                    78%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-primary-200">Low Stock</span>
                <div className="flex items-center gap-2 flex-1 max-w-[140px] ml-4">
                  <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-warning-400 rounded-full"
                      style={{ width: "15%" }}
                    />
                  </div>
                  <span className="text-white font-medium text-xs w-8 text-right">
                    15%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-primary-200">Out of Stock</span>
                <div className="flex items-center gap-2 flex-1 max-w-[140px] ml-4">
                  <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-error-400 rounded-full"
                      style={{ width: "7%" }}
                    />
                  </div>
                  <span className="text-white font-medium text-xs w-8 text-right">
                    7%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/15 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package className="text-accent-300" size={16} />
                <span className="text-primary-200 text-xs font-medium">
                  Products
                </span>
              </div>
              <p className="text-white text-xl font-bold">1,248</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="text-success-300" size={12} />
                <span className="text-success-300 text-xs">+24 this week</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/15 p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="text-warning-300" size={16} />
                <span className="text-primary-200 text-xs font-medium">
                  Low Stock
                </span>
              </div>
              <p className="text-white text-xl font-bold">23</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingDown className="text-error-300" size={12} />
                <span className="text-error-300 text-xs">Needs attention</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-primary-300/60 text-xs mt-10 max-w-md">
          The modern inventory management platform for tracking stock, managing
          suppliers, and making data-driven decisions.
        </p>
      </div>
    </div>
  );
};

export const Login = () => {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back to StockFlow IMS");
      navigate("/dashboard");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    if (!credentialResponse.credential) {
      toast.error("Google sign-in failed");
      return;
    }
    setLoading(true);
    try {
      await googleLogin(credentialResponse.credential);
      toast.success("Welcome back to StockFlow IMS");
      navigate("/dashboard");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-8 bg-white">
        <div className="w-full max-w-md mx-auto">
          <div className="flex lg:hidden items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center">
              <Boxes className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                StockFlow IMS
              </h1>
              <p className="text-xs text-gray-500 leading-tight">
                Inventory Management
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
          <p className="text-gray-500 mt-2 text-sm">
            Sign in to your account to manage your inventory.
          </p>

          <div className="mt-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google sign-in failed")}
              width="100%"
              text="continue_with"
            />
          </div>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="input pl-10"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input pl-10 pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Create one
            </Link>
          </p>

          <div className="mt-8 p-3 rounded-lg bg-gray-50 border border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              <span className="font-medium text-gray-600">Demo accounts:</span>
              <br />
              admin@stockflow.com / staff@stockflow.com — password: password123
            </p>
          </div>
        </div>
      </div>

      <BrandingSection />
    </div>
  );
};
