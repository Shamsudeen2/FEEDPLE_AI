import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeftIcon, LockIcon } from "../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import AuthLayout from "./AuthPageLayout";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate backend call
    console.log("Sending reset link to:", email);
    setIsSubmitted(true);
  };

  return (
    <AuthLayout>
      <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
        <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
          <Link
            to="/signin"
            className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <div className="size-5">
              <ChevronLeftIcon />
            </div>
            Back to sign in
          </Link>
        </div>
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div>
            <div className="mb-5 sm:mb-8 text-center sm:text-left">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-brand-50 rounded-full dark:bg-brand-500/10">
                <div className="text-brand-500 size-6">
                  <LockIcon />
                </div>
              </div>
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Forgot password?
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No worries, we'll send you reset instructions.
              </p>
            </div>
            
            {!isSubmitted ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <Label>
                      Email<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <button type="submit" className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
                      Send Reset Link
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="p-4 bg-green-50 rounded-lg dark:bg-green-500/10 border border-green-200 dark:border-green-500/20">
                <p className="text-sm text-green-800 dark:text-green-400">
                  If an account exists for <b>{email}</b>, you will receive password reset instructions.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/signin")}
                  className="mt-4 flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-brand-500 transition rounded-lg bg-brand-50 hover:bg-brand-100 dark:bg-brand-500/10 dark:hover:bg-brand-500/20"
                >
                  Return to Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
