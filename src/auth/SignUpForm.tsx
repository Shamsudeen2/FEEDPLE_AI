import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeCloseIcon, EyeIcon } from "../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Select from "../form/Select";
import AuthLayout from "./AuthPageLayout";
import { signUpWithApi, signUpVerifyOtpWithApi } from "../services/api";
import { useAuth } from "../context/useAuth";

interface SignUpFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  companyWebsite: string;
  industry: string;
}

export default function SignUpForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Basic, 2: Company, 3: OTP
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [formData, setFormData] = useState<SignUpFormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    companyWebsite: "",
    industry: "",
  });

  // Field validation errors
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const industryOptions = [
    { value: "technology", label: "Technology" },
    { value: "fintech", label: "Fintech" },
    { value: "ecommerce", label: "Ecommerce" },
    { value: "healthcare", label: "Healthcare" },
    { value: "education", label: "Education" },
    { value: "real_estate", label: "Real Estate" },
    { value: "logistics", label: "Logistics" },
    { value: "telecommunications", label: "Telecommunications" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "media", label: "Media" },
    { value: "other", label: "Other" },
  ];

  // Validation functions
  const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[a-z]/.test(password))
      return "Password must include a lowercase letter";
    if (!/[A-Z]/.test(password))
      return "Password must include an uppercase letter";
    if (!/[0-9]/.test(password)) return "Password must include a number";
    if (!/[!@#$%^&*()-+]/.test(password))
      return "Password must include a special character";
    return null;
  };

  const validateFullName = (name: string): string | null => {
    if (!name) return "Full name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    return null;
  };

  const validateCompanyName = (name: string): string | null => {
    if (!name) return "Company name is required";
    if (name.trim().length < 2)
      return "Company name must be at least 2 characters";
    return null;
  };

  const validateWebsite = (url: string): string | null => {
    if (!url) return null; // Optional field
    const urlRegex =
      /^(https?:\/\/)?(([\da-z.-]+)\.)?([a-z.]{2,6})([/\w.-]*)*\/?$/;
    if (!urlRegex.test(url)) return "Please enter a valid website URL";
    return null;
  };

  const validateIndustry = (industry: string): string | null => {
    if (!industry) return "Industry is required";
    const allowedValues = industryOptions.map((option) => option.value);
    if (!allowedValues.includes(industry)) {
      return "Please choose a valid industry from the list";
    }
    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleIndustryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      industry: value,
    }));

    if (fieldErrors.industry) {
      setFieldErrors((prev) => ({
        ...prev,
        industry: "",
      }));
    }
  };

  const validateField = (name: string, value: string): string | null => {
    switch (name) {
      case "fullName":
        return validateFullName(value);
      case "email":
        return validateEmail(value);
      case "password":
        return validatePassword(value);
      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (value !== formData.password) return "Passwords do not match";
        return null;
      case "companyName":
        return validateCompanyName(value);
      case "companyWebsite":
        return validateWebsite(value);
      default:
        return null;
    }
  };

  const validateStep1 = () => {
    const errors: { [key: string]: string } = {};
    const step1Fields: Array<keyof SignUpFormData> = [
      "fullName",
      "email",
      "password",
      "confirmPassword",
    ];

    step1Fields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        errors[field] = error;
      }
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Please fix the errors above");
      return false;
    }

    setFieldErrors({});
    return true;
  };

  const validateStep2 = () => {
    const errors: { [key: string]: string } = {};
    const companyNameError = validateField("companyName", formData.companyName);
    if (companyNameError) {
      errors.companyName = companyNameError;
    }

    const websiteError = validateField(
      "companyWebsite",
      formData.companyWebsite,
    );
    if (websiteError) {
      errors.companyWebsite = websiteError;
    }

    const industryError = validateIndustry(formData.industry);
    if (industryError) {
      errors.industry = industryError;
    }

    if (!isChecked) {
      errors.terms = "You must agree to the Terms and Conditions";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Please fix the errors above");
      return false;
    }

    setFieldErrors({});
    return true;
  };

  const handleNextStep = () => {
    setError("");
    setSuccess("");
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (step === 1) {
      handleNextStep();
      return;
    }

    if (step === 2) {
      if (!validateStep2()) {
        return;
      }

      // Directly sign up using backend signup endpoint (no OTP endpoint exists)
      setIsLoading(true);
      try {
        const response = await signUpWithApi({
          full_name: formData.fullName,
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirmPassword,
          company_name: formData.companyName,
          company_website: formData.companyWebsite,
          industry: formData.industry,
        });

        if (response.success) {
          setSuccess(
            "Account created successfully! Please verify the OTP sent to your email.",
          );
          const pending = {
            full_name: formData.fullName,
            email: formData.email,
            password: formData.password,
            confirm_password: formData.confirmPassword,
            company_name: formData.companyName,
            company_website: formData.companyWebsite,
            industry: formData.industry,
          };
          try {
            localStorage.setItem("pendingSignUp", JSON.stringify(pending));
          } catch (e) {
            console.warn("Could not persist pending signup data", e);
          }
          if (response.data?.token) {
            login(response.data.user, response.data.token);
            setTimeout(() => navigate("/dashboard"), 1500);
          } else {
            setTimeout(() => navigate("/verify-email"), 1500);
          }
        } else {
          if (response.validationErrors) {
            setFieldErrors(response.validationErrors);
          }
          setError(response.message || "Sign up failed");
        }
      } catch (err) {
        console.error(err);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Step 3: Verify OTP and complete signup
    if (step === 3) {
      if (!otpCode || otpCode.trim().length === 0) {
        setError("Please enter the OTP code");
        return;
      }

      setIsLoading(true);
      try {
        const response = await signUpVerifyOtpWithApi({
          full_name: formData.fullName,
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirmPassword,
          company_name: formData.companyName,
          company_website: formData.companyWebsite,
          industry: formData.industry,
          otp_code: otpCode,
        });

        if (response.success) {
          setSuccess("Account created successfully!");
          if (response.data?.token) {
            login(response.data.user, response.data.token);
            setTimeout(() => navigate("/dashboard"), 1500);
          } else {
            setTimeout(() => navigate("/signin"), 1500);
          }
        } else {
          if (response.validationErrors) {
            setFieldErrors(response.validationErrors);
          }
          setError(response.message || "Sign up verification failed");
        }
      } catch (err) {
        console.error(err);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
      return;
    }
  };

  const handleSendOtp = useCallback(async () => {
    if (!formData.email) {
      setError("Email is required to sign up");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const response = await signUpWithApi({
        full_name: formData.fullName,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        company_name: formData.companyName,
        company_website: formData.companyWebsite,
        industry: formData.industry,
      });

      if (response.success) {
        setSuccess(response.message || "Account created successfully!");
        // Store pending signup data so VerifyEmailForm can complete verification
        const pending = {
          full_name: formData.fullName,
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirmPassword,
          company_name: formData.companyName,
          company_website: formData.companyWebsite,
          industry: formData.industry,
        };
        try {
          localStorage.setItem("pendingSignUp", JSON.stringify(pending));
        } catch (e) {
          console.warn("Could not persist pending signup data", e);
        }
        setIsLoading(false);
        // Redirect user to the Verify Email page to enter OTP
        navigate("/verify-email");
        return response;
      } else {
        if (response.validationErrors) {
          setFieldErrors(response.validationErrors);
        }
        setError(response.message || "Failed to create account");
        setIsLoading(false);
        return response;
      }
    } catch (err) {
      console.error(err);
      setError("Failed to create account. Please try again.");
      setIsLoading(false);
      return undefined;
    }
  }, [
    formData.fullName,
    formData.email,
    formData.password,
    formData.confirmPassword,
    formData.companyName,
    formData.companyWebsite,
    formData.industry,
  ]);

  // Auto-send OTP when entering step 3. If backend returns the OTP (test/mock), auto-verify it.
  useEffect(() => {
    let cancelled = false;
    const tryAutoSendAndVerify = async () => {
      if (step === 3 && !otpSent && formData.email) {
        const resp = await handleSendOtp();
        // If mock/backend included the otp in response (for testing), auto-fill and verify
        const otpFromResp = (resp?.data as unknown as { otp?: string })?.otp;
        if (!cancelled && otpFromResp) {
          setOtpCode(otpFromResp);
          // auto-verify
          setIsLoading(true);
          try {
            const verifyResponse = await signUpVerifyOtpWithApi({
              full_name: formData.fullName,
              email: formData.email,
              password: formData.password,
              confirm_password: formData.confirmPassword,
              company_name: formData.companyName,
              company_website: formData.companyWebsite,
              industry: formData.industry,
              otp_code: otpFromResp,
            });

            if (verifyResponse.success) {
              setSuccess("Account created successfully!");
              if (verifyResponse.data?.token) {
                login(verifyResponse.data.user, verifyResponse.data.token);
                setTimeout(() => navigate("/dashboard"), 800);
              } else {
                setTimeout(() => navigate("/signin"), 800);
              }
            } else {
              if (verifyResponse.validationErrors) {
                setFieldErrors(verifyResponse.validationErrors);
              }
              setError(verifyResponse.message || "Sign up verification failed");
            }
          } catch (err) {
            console.error(err);
            setError("An unexpected error occurred during auto-verify");
          } finally {
            setIsLoading(false);
          }
        }
      }
    };

    tryAutoSendAndVerify();
    return () => {
      cancelled = true;
    };
  }, [
    step,
    otpSent,
    formData.fullName,
    formData.email,
    formData.password,
    formData.confirmPassword,
    formData.companyName,
    formData.companyWebsite,
    formData.industry,
    handleSendOtp,
    login,
    navigate,
  ]);

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
                          {step === 1
                            ? "Enter your email and password to sign up!"
                            : step === 2
                              ? "Tell us about your company!"
                              : "Verify your email with OTP"}
                        </p>
                        {(error || success) && (
                          <div className="pt-3">
                            {error && (
                              <p className="text-sm text-red-500">{error}</p>
                            )}
                            {success && (
                              <p className="text-sm text-green-500">
                                {success}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-1 items-center">
                        <span
                          className={`w-2 h-2 rounded-full ${step === 1 ? "bg-brand-500" : "bg-gray-300 dark:bg-gray-700"}`}
                        ></span>
                        <span
                          className={`w-2 h-2 rounded-full ${step === 2 ? "bg-brand-500" : "bg-gray-300 dark:bg-gray-700"}`}
                        ></span>
                        <span
                          className={`w-2 h-2 rounded-full ${step === 3 ? "bg-brand-500" : "bg-gray-300 dark:bg-gray-700"}`}
                        ></span>
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
                          value={formData.fullName}
                          onChange={handleInputChange}
                          error={!!fieldErrors.fullName}
                          className={
                            fieldErrors.fullName ? "border-red-500" : ""
                          }
                        />
                        {fieldErrors.fullName && (
                          <p className="mt-1 text-xs text-red-500">
                            {fieldErrors.fullName}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <Label>
                          Work Email<span className="text-error-500">*</span>
                        </Label>
                        <Input
                          type="email"
                          id="email"
                          name="email"
                          placeholder="Enter your work email"
                          value={formData.email}
                          onChange={handleInputChange}
                          error={!!fieldErrors.email}
                          className={fieldErrors.email ? "border-red-500" : ""}
                        />
                        {fieldErrors.email && (
                          <p className="mt-1 text-xs text-red-500">
                            {fieldErrors.email}
                          </p>
                        )}
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
                              id="password"
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              error={!!fieldErrors.password}
                              maxLength={72}
                              hint="Password, must include a uppercase lowercase and special character and be at least 8 characters long"
                              className={
                                fieldErrors.password ? "border-red-500" : ""
                              }
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
                          {fieldErrors.password && (
                            <p className="mt-1 text-xs text-red-500">
                              {fieldErrors.password}
                            </p>
                          )}
                        </div>

                        {/* Confirm Password */}
                        <div className="sm:col-span-1">
                          <Label>
                            Confirm Password
                            <span className="text-error-500">*</span>
                          </Label>
                          <div className="relative">
                            <Input
                              placeholder="Confirm password"
                              type={showConfirmPassword ? "text" : "password"}
                              id="confirmPassword"
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              error={!!fieldErrors.confirmPassword}
                              maxLength={72}
                              className={
                                fieldErrors.confirmPassword
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                            <span
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
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
                          {fieldErrors.confirmPassword && (
                            <p className="mt-1 text-xs text-red-500">
                              {fieldErrors.confirmPassword}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50"
                          disabled={isLoading}
                        >
                          {isLoading ? "Validating..." : "Next Step"}
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
                          value={formData.companyName}
                          onChange={handleInputChange}
                          error={!!fieldErrors.companyName}
                          className={
                            fieldErrors.companyName ? "border-red-500" : ""
                          }
                        />
                        {fieldErrors.companyName && (
                          <p className="mt-1 text-xs text-red-500">
                            {fieldErrors.companyName}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        {/* Company Website */}
                        <div className="sm:col-span-1">
                          <Label>
                            Company Website{" "}
                            <span className="font-normal text-gray-400">
                              (Optional)
                            </span>
                          </Label>
                          <Input
                            type="url"
                            id="companyWebsite"
                            name="companyWebsite"
                            placeholder="https://example.com"
                            value={formData.companyWebsite}
                            onChange={handleInputChange}
                            error={!!fieldErrors.companyWebsite}
                            className={
                              fieldErrors.companyWebsite ? "border-red-500" : ""
                            }
                          />
                          {fieldErrors.companyWebsite && (
                            <p className="mt-1 text-xs text-red-500">
                              {fieldErrors.companyWebsite}
                            </p>
                          )}
                        </div>

                        {/* Industry */}
                        <div className="sm:col-span-1">
                          <Label>Industry</Label>
                          <Select
                            options={industryOptions}
                            placeholder="Select industry"
                            defaultValue={formData.industry}
                            onChange={handleIndustryChange}
                            className={
                              fieldErrors.industry ? "border-red-500" : ""
                            }
                          />
                          {fieldErrors.industry && (
                            <p className="mt-1 text-xs text-red-500">
                              {fieldErrors.industry}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Terms & Conditions */}
                      <div className="flex items-start gap-3 pt-2">
                        <Checkbox
                          className="w-5 h-5 mt-1"
                          checked={isChecked}
                          onChange={setIsChecked}
                        />
                        <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                          By creating an account you agree to the{" "}
                          <span className="text-gray-800 dark:text-white/90">
                            Terms and Conditions
                          </span>
                          {", "}
                          and our{" "}
                          <span className="text-gray-800 dark:text-white">
                            Privacy Policy
                          </span>
                        </p>
                      </div>
                      {fieldErrors.terms && (
                        <p className="text-xs text-red-500">
                          {fieldErrors.terms}
                        </p>
                      )}

                      <div className="flex gap-4 pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            setStep(1);
                            setFieldErrors({});
                            setError("");
                            setSuccess("");
                          }}
                          className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-gray-700 transition rounded-lg border border-gray-200 dark:border-gray-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isLoading ? "Creating..." : "Create Account"}
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                      <h3 className="pt-2 text-lg font-semibold text-gray-800 dark:text-white/90">
                        Verify Your Email
                      </h3>

                      {!otpSent ? (
                        <div>
                          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                            We've sent a verification code to{" "}
                            <span className="font-semibold text-gray-800 dark:text-white">
                              {formData.email}
                            </span>
                          </p>
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={isLoading}
                            className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isLoading ? "Sending..." : "Send OTP Code"}
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <Label>
                              OTP Code<span className="text-error-500">*</span>
                            </Label>
                            <Input
                              type="text"
                              id="otpCode"
                              placeholder="Enter 6-digit OTP"
                              value={otpCode}
                              onChange={(e) => setOtpCode(e.target.value)}
                              maxLength={6}
                              className={
                                fieldErrors.otpCode ? "border-red-500" : ""
                              }
                            />
                            {fieldErrors.otpCode && (
                              <p className="mt-1 text-xs text-red-500">
                                {fieldErrors.otpCode}
                              </p>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setOtpSent(false);
                              setOtpCode("");
                              setSuccess("");
                            }}
                            className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                          >
                            Didn't receive OTP? Resend
                          </button>
                        </div>
                      )}

                      <div className="flex gap-4 pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            setStep(2);
                            setOtpCode("");
                            setOtpSent(false);
                            setError("");
                            setSuccess("");
                          }}
                          className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-gray-700 transition rounded-lg border border-gray-200 dark:border-gray-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={
                            isLoading || !otpSent || otpCode.length !== 6
                          }
                          className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isLoading ? "Verifying..." : "Complete Signup"}
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
