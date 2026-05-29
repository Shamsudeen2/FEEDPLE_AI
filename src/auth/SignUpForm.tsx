import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import AuthLayout from "./AuthPageLayout";

export default function SignUpForm() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      // Simulate backend call...
      navigate("/verify-email");
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div>
            <div>
              <form onSubmit={handleSignUp}>
                <div className="space-y-5">
                  <div className="w-full pt-10 mb-5">
                    <div className="mb-5 sm:mb-8 flex justify-between items-center">
                      <div>
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                          Sign Up
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {step === 1 ? "Enter your email and password to sign up!" : "Tell us about your company!"}
                        </p>
                      </div>
                      <div className="flex space-x-1 items-center">
                        <span className={`w-2 h-2 rounded-full ${step === 1 ? 'bg-brand-500' : 'bg-gray-300 dark:bg-gray-700'}`}></span>
                        <span className={`w-2 h-2 rounded-full ${step === 2 ? 'bg-brand-500' : 'bg-gray-300 dark:bg-gray-700'}`}></span>
                      </div>
                    </div>
                  </div>

                  {step === 1 && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      {/* Full Name */}
                      <div>
                        <Label>
                          Full Name<span className="text-error-500">*</span>
                        </Label>
                        <Input
                          type="text"
                          id="fullName"
                          name="fullName"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>

                      {/* Work Email */}
                      <div>
                        <Label>
                          Work Email<span className="text-error-500">*</span>
                        </Label>
                        <Input
                          type="email"
                          id="email"
                          name="email"
                          placeholder="Enter your work email"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        {/* Password */}
                        <div className="sm:col-span-1">
                          <Label>
                            Password<span className="text-error-500">*</span>
                          </Label>
                          <div className="relative">
                            <Input
                              placeholder="Enter your password"
                              type={showPassword ? "text" : "password"}
                              required
                            />
                            <span
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                            >
                              {showPassword ? (
                                <div className="fill-gray-500 dark:fill-gray-400 size-5">
                                  <EyeIcon />
                                </div>
                              ) : (
                                <div className="fill-gray-500 dark:fill-gray-400 size-5">
                                  <EyeCloseIcon />
                                </div>
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="sm:col-span-1">
                          <Label>
                            Confirm Password<span className="text-error-500">*</span>
                          </Label>
                          <div className="relative">
                            <Input
                              placeholder="Confirm password"
                              type={showConfirmPassword ? "text" : "password"}
                              required
                            />
                            <span
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                            >
                              {showConfirmPassword ? (
                                <div className="fill-gray-500 dark:fill-gray-400 size-5">
                                  <EyeIcon />
                                </div>
                              ) : (
                                <div className="fill-gray-500 dark:fill-gray-400 size-5">
                                  <EyeCloseIcon />
                                </div>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Next Button */}
                      <div className="pt-2">
                        <button 
                          type="button" 
                          onClick={() => setStep(2)}
                          className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                        >
                           Next Step
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                      <h3 className="pt-2 text-lg font-semibold text-gray-800 dark:text-white/90">
                        Company Information
                      </h3>

                      {/* Company Name */}
                      <div>
                        <Label>
                          Company Name<span className="text-error-500">*</span>
                        </Label>
                        <Input
                          type="text"
                          id="companyName"
                          name="companyName"
                          placeholder="Enter your company name"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        {/* Company Website */}
                        <div className="sm:col-span-1">
                          <Label>
                            Company Website <span className="font-normal text-gray-400">(Optional)</span>
                          </Label>
                          <Input
                            type="url"
                            id="website"
                            name="website"
                            placeholder="https://example.com"
                          />
                        </div>

                        {/* Phone Number */}
                        <div className="sm:col-span-1">
                          <Label>
                            Phone Number <span className="font-normal text-gray-400">(Optional)</span>
                          </Label>
                          <Input
                            type="tel"
                            id="phone"
                            name="phone"
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>
                      </div>

                      {/* Checkbox */}
                      <div className="flex items-center gap-3 pt-2">
                        <Checkbox
                          className="w-5 h-5"
                          checked={isChecked}
                          onChange={setIsChecked}
                        />
                        <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                          By creating an account you agree to the{" "}
                          <span className="text-gray-800 dark:text-white/90">
                            Terms and Conditions
                          </span>{", "}
                          and our{" "}
                          <span className="text-gray-800 dark:text-white">
                            Privacy Policy
                          </span>
                        </p>
                      </div>
                      
                      {/* Buttons */}
                      <div className="flex gap-4 pt-2">
                        <button 
                          type="button" 
                          onClick={() => setStep(1)}
                          className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-gray-700 transition rounded-lg border border-gray-200 dark:border-gray-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          Back
                        </button>
                        <button 
                          type="submit"
                          className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                        >
                          Create Account
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </form>

              <div className="mt-5 pb-5">
                <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                  Already have an account?{" "}
                  <Link
                    to="/signin"
                    className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Sign In
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
