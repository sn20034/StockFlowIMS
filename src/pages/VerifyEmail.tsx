import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Boxes, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { authService } from "../services/authService";

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      return;
    }
    authService
      .verifyEmail(token)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      <div className="flex items-center gap-2.5 mb-8">
        <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center">
          <Boxes className="text-white" size={24} />
        </div>
        <h1 className="text-lg font-bold text-gray-900">StockFlow IMS</h1>
      </div>

      <div className="w-full max-w-sm text-center">
        {status === "loading" && (
          <>
            <Loader2
              className="mx-auto mb-4 animate-spin text-primary-600"
              size={40}
            />
            <p className="text-gray-600">Verifying your email…</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="mx-auto mb-4 text-success-500" size={48} />
            <h2 className="text-xl font-bold text-gray-900">Email verified</h2>
            <p className="text-gray-500 mt-2 text-sm">
              Your account is now active. You can sign in.
            </p>
            <Link
              to="/login"
              className="btn-primary inline-flex mt-6 px-6 py-2.5"
            >
              Go to Sign in
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="mx-auto mb-4 text-error-500" size={48} />
            <h2 className="text-xl font-bold text-gray-900">
              Verification failed
            </h2>
            <p className="text-gray-500 mt-2 text-sm">
              This link is invalid or has expired.
            </p>
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700 font-medium text-sm mt-6 inline-block"
            >
              Back to Sign in
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
