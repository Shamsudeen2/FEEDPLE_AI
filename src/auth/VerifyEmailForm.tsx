import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeftIcon, EnvelopeIcon } from "../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import AuthLayout from "./AuthPageLayout";

export default function VerifyEmailForm() {
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    // In the future, this will call the backend API
    console.log("Verifying token:", token);
    // Mocking success and redirecting to the dashboard
    // navigate("/dashboard");
  };

  return (
    <AuthLayout>
      <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
        <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
        </div>
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
                We sent a verification code to your email. Enter the code from the email in the field below.
              </p>
            </div>
            
            <form onSubmit={handleVerify}>
              <div className="space-y-6">
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
                  <button type="submit" className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
                    Verify Email
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
