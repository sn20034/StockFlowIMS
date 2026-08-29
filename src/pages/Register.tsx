import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Boxes,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Briefcase,
  TrendingUp,
  Package,
  BarChart3,
  CheckCircle2,
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
            Start managing your <br />
            inventory smarter.
          </h1>
          <p className="text-primary-200 mt-4 max-w-md text-sm">
            Join StockFlow IMS to track stock levels, manage suppliers, record
            transactions, and generate reports — all in one place.
          </p>
        </div>

        <div className="space-y-3 max-w-md">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/15 p-4">
            <div className="w-10 h-10 rounded-lg bg-accent-500/20 flex items-center justify-center flex-shrink-0">
              <Package className="text-accent-300" size={20} />
            </div>
            <div>
              <p className="text-white font-medium text-sm">
                Complete Product Management
              </p>
              <p className="text-primary-200 text-xs mt-0.5">
                Add, edit, search and filter your entire catalog
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/15 p-4">
            <div className="w-10 h-10 rounded-lg bg-primary-400/20 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="text-primary-200" size={20} />
            </div>
            <div>
              <p className="text-white font-medium text-sm">
                Real-time Stock Tracking
              </p>
              <p className="text-primary-200 text-xs mt-0.5">
                Automatic stock-in and stock-out with full history
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/15 p-4">
            <div className="w-10 h-10 rounded-lg bg-success-500/20 flex items-center justify-center flex-shrink-0">
              <BarChart3 className="text-success-300" size={20} />
            </div>
            <div>
              <p className="text-white font-medium text-sm">
                Analytics & Reports
              </p>
              <p className="text-primary-200 text-xs mt-0.5">
                Dashboard insights and CSV exports for your data
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Register = () => {
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("staff");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const result = await register(name, email, password, role);
      setRegisteredEmail(result.email);
      toast.success("Account created! Check your email to verify.");
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
      toast.success("Welcome to StockFlow IMS");
      navigate("/dashboard");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  if (registeredEmail) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
        <div className="w-full max-w-sm text-center">
          <CheckCircle2 className="mx-auto mb-4 text-success-500" size={48} />
          <h2 className="text-xl font-bold text-gray-900">Check your email</h2>
          <p className="text-gray-500 mt-2 text-sm">
            We sent a verification link to{" "}
            <span className="font-medium text-gray-700">{registeredEmail}</span>
            . Click it to activate your account.
          </p>
          <Link
            to="/login"
            className="text-primary-600 hover:text-primary-700 font-medium text-sm mt-6 inline-block"
          >
            Back to Sign in
          </Link>
        </div>
      </div>
    );
  }

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

          <h2 className="text-2xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Get started with StockFlow IMS in minutes.
          </p>

          <div className="mt-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google sign-in failed")}
              width="100%"
              text="signup_with"
            />
          </div>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Full name</label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="input pl-10"
                />
              </div>
            </div>

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
                  placeholder="At least 6 characters"
                  className="input pl-10 pr-10"
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

            <div>
              <label className="label">Confirm password</label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="label">Role</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("staff")}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-lg border transition-all ${
                    role === "staff"
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <Briefcase size={18} />
                  <div className="text-left">
                    <p className="text-sm font-medium">Staff</p>
                    <p className="text-xs opacity-70">Operational access</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-lg border transition-all ${
                    role === "admin"
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <Shield size={18} />
                  <div className="text-left">
                    <p className="text-sm font-medium">Admin</p>
                    <p className="text-xs opacity-70">Full management access</p>
                  </div>
                </button>
              </div>
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
                  Create account
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <BrandingSection />
    </div>
  );
};
