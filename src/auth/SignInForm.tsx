import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeCloseIcon, EyeIcon } from "../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import AuthLayout from "./AuthPageLayout";
import {
  signInWithApi,
  sendOtpWithApi,
  verifyOtpWithApi,
} from "../services/api";
import { useAuth } from "../context/useAuth";

export default function SignInForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [signInMethod, setSignInMethod] = useState<"password" | "email">(
    "password",
  );
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  // Loading / feedback state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle password sign in
  const handlePasswordSignIn = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setIsLoading(true);
    try {
      const res = await signInWithApi(email, password);
      if (res.success && res.data) {
        setSuccess("Signed in successfully — redirecting...");
        login(res.data.user, res.data.token);
        setTimeout(() => navigate("/dashboard"), 300);
      } else {
        setError(res.message || "Sign in failed");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle send OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Email is required");
      return;
    }

    setIsLoading(true);
    try {
      const res = await sendOtpWithApi(email);
      if (res.success) {
        setOtpSent(true);
        setSuccess("OTP sent — check your email");
      } else {
        setError(res.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle verify OTP
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");
    setSuccess("");

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const res = await verifyOtpWithApi(email, otp);
      if (res.success && res.data) {
        setSuccess("OTP verified successfully — redirecting...");
        login(res.data.user, res.data.token);
        setTimeout(() => navigate("/dashboard"), 300);
      } else {
        setError(res.message || "OTP verification failed");
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
      <div className="flex flex-col flex-1 w-full max-w-md mx-auto overflow-y-auto no-scrollbar">
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div>
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Sign In
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {signInMethod === "password"
                  ? "Enter your email and password to sign in!"
                  : "Sign in with a one-time password"}
              </p>

              {error && (
                <div className="mt-3 rounded-md p-3 text-sm text-error-600 bg-error-50 dark:bg-error-500/10 dark:text-error-400">
                  {error}
                </div>
              )}

              {success && (
                <div className="mt-3 rounded-md p-3 text-sm text-success-600 bg-success-50 dark:bg-success-500/10 dark:text-success-400">
                  {success}
                </div>
              )}
            </div>

            {/* Sign In Method Toggle */}
            <div className="mb-6 flex gap-2">
              <button
                onClick={() => {
                  setSignInMethod("password");
                  setOtpSent(false);
                  setOtp("");
                }}
                className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition ${
                  signInMethod === "password"
                    ? "bg-brand-500 text-white"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                Password
              </button>
              <button
                onClick={() => {
                  setSignInMethod("email");
                  setOtpSent(false);
                  setOtp("");
                }}
                className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition ${
                  signInMethod === "email"
                    ? "bg-brand-500 text-white"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                OTP
              </button>
            </div>

            <div>
              {/* Password Sign In */}
              {signInMethod === "password" && (
                <form onSubmit={handlePasswordSignIn}>
                  <div className="space-y-6">
                    <div>
                      <Label>
                        Email <span className="text-error-500">*</span>{" "}
                      </Label>
                      <Input
                        placeholder="info@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>
                        Password <span className="text-error-500">*</span>{" "}
                      </Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                        >
                          <span className="fill-gray-500 dark:fill-gray-400 size-5 inline-flex">
                            {showPassword ? <EyeIcon /> : <EyeCloseIcon />}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Checkbox checked={isChecked} onChange={setIsChecked} />
                        <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                          Keep me logged in
                        </span>
                      </div>
                      {/* <Link
                        to="/forgot-password"
                        className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400"
                      >
                        Forgot Password?
                      </Link> */}
                    </div>
                    <div>
                      <Button
                        className="w-full"
                        size="sm"
                        onClick={handlePasswordSignIn}
                        disabled={isLoading}
                      >
                        {isLoading ? "Signing in..." : "Sign in"}
                      </Button>
                    </div>
                  </div>
                </form>
              )}

              {/* Email OTP Sign In */}
              {signInMethod === "email" && (
                <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
                  <div className="space-y-6">
                    {!otpSent ? (
                      <>
                        <div>
                          <Label>
                            Email <span className="text-error-500">*</span>{" "}
                          </Label>
                          <Input
                            type="email"
                            placeholder="info@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <div>
                          <Button
                            className="w-full"
                            size="sm"
                            onClick={handleSendOtp}
                            disabled={isLoading}
                          >
                            {isLoading ? "Sending..." : "Send OTP"}
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            We've sent a 6-digit code to{" "}
                            <strong>{email}</strong>
                          </p>
                        </div>
                        <div>
                          <Label>
                            Enter OTP{" "}
                            <span className="text-error-500">*</span>{" "}
                          </Label>
                          <Input
                            type="text"
                            placeholder="000000"
                            value={otp}
                            onChange={(e) =>
                              setOtp(
                                e.target.value.replace(/\D/g, "").slice(0, 6),
                              )
                            }
                          />
                          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            Enter the 6-digit code sent to your email
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            className="flex-1"
                            size="sm"
                            onClick={() => {
                              setOtpSent(false);
                              setOtp("");
                              setEmail("");
                            }}
                            disabled={isLoading}
                          >
                            Change Email
                          </Button>
                          <button
                            className="flex-1 inline-flex items-center justify-center rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
                            onClick={handleVerifyOtp}
                            disabled={isLoading || otp.length !== 6}
                          >
                            {isLoading ? "Verifying..." : "Verify OTP"}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </form>
              )}

              <div className="mt-5">
                <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                  Don&apos;t have an account? {""}
                  <Link
                    to="/register"
                    className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
