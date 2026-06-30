import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EnvelopeIcon } from "../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import AuthLayout from "./AuthPageLayout";
import { signUpVerifyOtpWithApi } from "../services/api";
import { useAuth } from "../context/useAuth";

interface PendingSignUpData {
  [key: string]: string | number | boolean;
}

export default function VerifyEmailForm() {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token || token.trim().length === 0) {
      setError("Please enter the verification code");
      return;
    }

    // Load pending signup data saved by the SignUp form
    const pendingRaw = localStorage.getItem("pendingSignUp");
    if (!pendingRaw) {
      setError("No signup in progress. Please register first.");
      return;
    }

    let pendingData: PendingSignUpData;
    try {
      pendingData = JSON.parse(pendingRaw);
    } catch (err) {
      console.error("Failed to parse pending signup data", err);
      setError("Invalid signup data. Please register again.");
      return;
    }

    // Validate that all required fields are present
    const requiredFields = [
      "full_name",
      "email",
      "password",
      "confirm_password",
      "company_name",
    ];
    const missingFields = requiredFields.filter((field) => !pendingData[field]);
    if (missingFields.length > 0) {
      setError("Incomplete signup data. Please register again.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        full_name: String(pendingData.full_name),
        email: String(pendingData.email),
        password: String(pendingData.password),
        confirm_password: String(pendingData.confirm_password),
        company_name: String(pendingData.company_name),
        company_website: pendingData.company_website
          ? String(pendingData.company_website)
          : "",
        industry: pendingData.industry ? String(pendingData.industry) : "",
        otp_code: token,
      };
      console.log("[API] verify signup payload", payload);
      const resp = await signUpVerifyOtpWithApi(payload);

      if (resp.success) {
        setSuccess(resp.message || "Email verified. Redirecting...");
        // Clear pending data
        try {
          localStorage.removeItem("pendingSignUp");
        } catch {
          // Silently ignore errors when clearing localStorage
        }

        if (resp.data?.token) {
          login(resp.data.user, resp.data.token);
          setTimeout(() => navigate("/dashboard"), 800);
        } else {
          setTimeout(() => navigate("/signin"), 800);
        }
      } else {
        setError(resp.message || "Verification failed");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
        <div className="w-full max-w-md mx-auto mb-5 sm:pt-10"></div>
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div>
            <div className="mb-5 sm:mb-8 text-center sm:text-left">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-brand-50 rounded-full dark:bg-brand-500/10">
                <div className="text-brand-500 size-6">
                  <EnvelopeIcon />
                </div>
              </div>
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Verify your email
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                We sent a verification code to your email. Enter the code from
                the email in the field below.
              </p>
            </div>

            <form onSubmit={handleVerify}>
              <div className="space-y-6">
                {error && (
                  <div className="p-3 text-sm text-error-600 bg-error-50 rounded-lg dark:bg-error-500/10 dark:text-error-400">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="p-3 text-sm text-success-600 bg-success-50 rounded-lg dark:bg-success-500/10 dark:text-success-400">
                    {success}
                  </div>
                )}
                <div>
                  <Label>
                    Verification Code<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="token"
                    name="token"
                    maxLength={6}
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="text-center tracking-widest text-xl"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Verifying..." : "Verify Email"}
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Didn&apos;t receive the code?{" "}
                <button
                  type="button"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400 font-medium"
                >
                  Click to resend
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
