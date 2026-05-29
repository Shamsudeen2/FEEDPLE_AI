/**
 * Mock API Service
 * 
 * This file contains all mock API calls for testing.
 * Replace fetch calls with actual API endpoints when backend is ready.
 * 
 * Structure: All functions return a Promise with success/error responses
 * to mimic real API behavior including loading states and error handling.
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface MockUser {
  id: string;
  fullName: string;
  email: string;
  password: string;
  company?: string;
  website?: string;
  phone?: string;
  createdAt: string;
  avatar?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: Omit<MockUser, 'password'>;
    token: string;
    expiresIn: number;
  };
  error?: string;
  errorCode?: string;
}

export interface OtpResponse {
  success: boolean;
  message: string;
  data?: {
    otpSent: true;
    email: string;
    expiresIn: number; // seconds until OTP expires
  };
  error?: string;
  errorCode?: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data?: {
    user: Omit<MockUser, 'password'>;
    token: string;
    expiresIn: number;
  };
  error?: string;
  errorCode?: string;
}

export interface SignUpResponse {
  success: boolean;
  message: string;
  data?: {
    user: Omit<MockUser, 'password'>;
  };
  error?: string;
  errorCode?: string;
}

// ============================================================================
// MOCK DATABASE
// ============================================================================

const MOCK_USERS: MockUser[] = [
  {
    id: 'user_001',
    fullName: 'John Doe',
    email: 'john@example.com',
    password: 'password123', // In real app, this would be hashed
    company: 'Acme Corp',
    website: 'https://acme.com',
    phone: '+1 (555) 123-4567',
    createdAt: new Date('2024-01-15').toISOString(),
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 'user_002',
    fullName: 'Jane Smith',
    email: 'jane@example.com',
    password: 'securepass456',
    company: 'Tech Solutions',
    website: 'https://techsolutions.io',
    phone: '+1 (555) 987-6543',
    createdAt: new Date('2024-02-20').toISOString(),
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: 'user_003',
    fullName: 'Demo User',
    email: 'demo@feedple.ai',
    password: 'demo123456',
    company: 'Feedple AI',
    website: 'https://feedple.ai',
    phone: '+1 (555) 456-7890',
    createdAt: new Date('2024-03-01').toISOString(),
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
];

// Store for OTP attempts (in-memory, resets on page refresh)
const OTP_STORE: { [email: string]: { code: string; expiresAt: number } } = {};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Simulates network delay
 */
const delay = (ms: number = 1000) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generates a 6-digit OTP
 */
const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Generates a mock JWT token
 */
const generateToken = (userId: string): string => {
  const payload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
  };
  // In real world, this would be signed by the backend
  return `mock_jwt_${userId}_${payload.exp}`;
};

/**
 * Logs mock API calls for debugging
 */
const logApiCall = (
  method: string,
  endpoint: string,
  data?: unknown,
  result?: unknown
) => {
  console.log(
    `%c[Mock API] ${method} ${endpoint}`,
    'color: #4CAF50; font-weight: bold;',
    'Data:', data,
    'Result:', result
  );
};

// ============================================================================
// AUTHENTICATION API CALLS
// ============================================================================

/**
 * Sign in with email and password
 * 
 * Test credentials:
 * - email: john@example.com, password: password123
 * - email: jane@example.com, password: securepass456
 * - email: demo@feedple.ai, password: demo123456
 */
export const signInWithPassword = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    await delay(1500); // Simulate network delay

    // Validate input
    if (!email || !password) {
      return {
        success: false,
        message: 'Email and password are required',
        errorCode: 'VALIDATION_ERROR',
      };
    }

    // Find user
    const user = MOCK_USERS.find((u) => u.email === email);

    if (!user) {
      logApiCall('POST', '/auth/signin', { email }, { success: false });
      return {
        success: false,
        message: 'No account found with this email',
        errorCode: 'USER_NOT_FOUND',
      };
    }

    // Check password
    if (user.password !== password) {
      logApiCall('POST', '/auth/signin', { email }, { success: false });
      return {
        success: false,
        message: 'Incorrect password',
        errorCode: 'INVALID_PASSWORD',
      };
    }

    // Success
    const token = generateToken(user.id);
    const { password: removedPassword, ...userWithoutPassword } = user;
    void removedPassword;

    logApiCall('POST', '/auth/signin', { email }, { success: true, token });

    return {
      success: true,
      message: 'Signed in successfully',
      data: {
        user: userWithoutPassword,
        token,
        expiresIn: 86400, // 24 hours in seconds
      },
    };
  } catch (error) {
    console.error('Sign in error:', error);
    return {
      success: false,
      message: 'An error occurred during sign in',
      errorCode: 'SIGN_IN_ERROR',
    };
  }
};

/**
 * Send OTP to email
 * 
 * Test it with any email address
 * OTP will be generated and logged to console
 */
export const sendOtp = async (email: string): Promise<OtpResponse> => {
  try {
    await delay(1200); // Simulate network delay

    // Validate email
    if (!email) {
      return {
        success: false,
        message: 'Email is required',
        errorCode: 'VALIDATION_ERROR',
      };
    }

    // Generate OTP (valid for 10 minutes)
    const otp = generateOtp();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP
    OTP_STORE[email] = { code: otp, expiresAt };

    // Log OTP to console for testing
    console.log(
      `%c[Mock API] OTP for ${email}: ${otp}`,
      'color: #2196F3; font-weight: bold; font-size: 16px;'
    );

    logApiCall('POST', '/auth/send-otp', { email }, { success: true });

    return {
      success: true,
      message: `OTP sent to ${email}. Check your console for the test OTP.`,
      data: {
        otpSent: true,
        email,
        expiresIn: 600, // 10 minutes in seconds
      },
    };
  } catch (error) {
    console.error('Send OTP error:', error);
    return {
      success: false,
      message: 'Failed to send OTP',
      errorCode: 'SEND_OTP_ERROR',
    };
  }
};

/**
 * Verify OTP and sign in
 * 
 * Use the OTP that was logged to console when sendOtp was called
 */
export const verifyOtp = async (
  email: string,
  otp: string
): Promise<VerifyOtpResponse> => {
  try {
    await delay(1500); // Simulate network delay

    // Validate input
    if (!email || !otp) {
      return {
        success: false,
        message: 'Email and OTP are required',
        errorCode: 'VALIDATION_ERROR',
      };
    }

    // Check if OTP exists and is not expired
    const otpData = OTP_STORE[email];
    if (!otpData) {
      return {
        success: false,
        message: 'OTP not found. Please request a new one.',
        errorCode: 'OTP_NOT_FOUND',
      };
    }

    if (Date.now() > otpData.expiresAt) {
      delete OTP_STORE[email];
      return {
        success: false,
        message: 'OTP has expired. Please request a new one.',
        errorCode: 'OTP_EXPIRED',
      };
    }

    // Verify OTP
    if (otpData.code !== otp) {
      return {
        success: false,
        message: 'Invalid OTP. Please check and try again.',
        errorCode: 'INVALID_OTP',
      };
    }

    // Clear OTP
    delete OTP_STORE[email];

    // Create or retrieve user
    let user = MOCK_USERS.find((u) => u.email === email);
    if (!user) {
      // For OTP login, create a temporary user if not exists
      user = {
        id: `user_${Date.now()}`,
        fullName: email.split('@')[0],
        email,
        password: '', // OTP users don't have passwords
        createdAt: new Date().toISOString(),
      };
      MOCK_USERS.push(user);
    }

    // Generate token
    const token = generateToken(user.id);
    const { password: removedPassword, ...userWithoutPassword } = user;
    void removedPassword;

    logApiCall('POST', '/auth/verify-otp', { email, otp }, { success: true });

    return {
      success: true,
      message: 'Signed in successfully via OTP',
      data: {
        user: userWithoutPassword,
        token,
        expiresIn: 86400, // 24 hours in seconds
      },
    };
  } catch (err) {
    console.error('Verify OTP error:', err);
    return {
      success: false,
      message: 'Failed to verify OTP',
      errorCode: 'VERIFY_OTP_ERROR',
    };
  }
};

// ============================================================================
// REGISTRATION API CALLS
// ============================================================================

/**
 * Sign up with email, password, and company details
 */
export const signUp = async (signUpData: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  website?: string;
  phone?: string;
  agreeToTerms: boolean;
}): Promise<SignUpResponse> => {
  try {
    await delay(2000); // Simulate network delay

    // Validate input
    if (
      !signUpData.fullName ||
      !signUpData.email ||
      !signUpData.password ||
      !signUpData.companyName
    ) {
      return {
        success: false,
        message: 'All required fields must be filled',
        errorCode: 'VALIDATION_ERROR',
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signUpData.email)) {
      return {
        success: false,
        message: 'Please enter a valid email address',
        errorCode: 'INVALID_EMAIL',
      };
    }

    // Validate password strength
    if (signUpData.password.length < 8) {
      return {
        success: false,
        message: 'Password must be at least 8 characters long',
        errorCode: 'WEAK_PASSWORD',
      };
    }

    // Check password match
    if (signUpData.password !== signUpData.confirmPassword) {
      return {
        success: false,
        message: 'Passwords do not match',
        errorCode: 'PASSWORD_MISMATCH',
      };
    }

    // Check if user already exists
    const existingUser = MOCK_USERS.find((u) => u.email === signUpData.email);
    if (existingUser) {
      return {
        success: false,
        message: 'An account with this email already exists',
        errorCode: 'USER_EXISTS',
      };
    }

    // Check if terms are accepted
    if (!signUpData.agreeToTerms) {
      return {
        success: false,
        message: 'You must agree to the Terms and Conditions',
        errorCode: 'TERMS_NOT_ACCEPTED',
      };
    }

    // Create new user
    const newUser: MockUser = {
      id: `user_${Date.now()}`,
      fullName: signUpData.fullName,
      email: signUpData.email,
      password: signUpData.password,
      company: signUpData.companyName,
      website: signUpData.website,
      phone: signUpData.phone,
      createdAt: new Date().toISOString(),
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 100)}`,
    };

    // Add to mock database
    MOCK_USERS.push(newUser);

    const { password: removedPassword, ...userWithoutPassword } = newUser;
    void removedPassword;

    logApiCall('POST', '/auth/signup', { email: signUpData.email }, { success: true });

    return {
      success: true,
      message: 'Account created successfully. Please verify your email.',
      data: {
        user: userWithoutPassword,
      },
    };
  } catch (err) {
    console.error('Sign up error:', err);
    return {
      success: false,
      message: 'An error occurred during sign up',
      errorCode: 'SIGNUP_ERROR',
    };
  }
};

// ============================================================================
// UTILITY API CALLS
// ============================================================================

/**
 * Verify email (after sign up)
 */
export const verifyEmail = async (
  email: string,
  verificationCode: string
): Promise<{ success: boolean; message: string }> => {
  void verificationCode;
  try {
    await delay(1000);

    // In mock, always succeed
    logApiCall(
      'POST',
      '/auth/verify-email',
      { email },
      { success: true }
    );

    return {
      success: true,
      message: 'Email verified successfully',
    };
  } catch {
    return {
      success: false,
      message: 'Failed to verify email',
    };
  }
};

/**
 * Get current user from token (for session persistence)
 */
export const getCurrentUser = async (
  token: string
): Promise<{ success: boolean; user?: Omit<MockUser, 'password'> }> => {
  try {
    await delay(500);

    // Extract user ID from mock token
    const match = token.match(/mock_jwt_(\w+)_/);
    if (!match) {
      return { success: false };
    }

    const userId = match[1];
    const user = MOCK_USERS.find((u) => u.id === userId);

    if (!user) {
      return { success: false };
    }

    const { password: removedPassword, ...userWithoutPassword } = user;
    void removedPassword;
    return {
      success: true,
      user: userWithoutPassword,
    };
  } catch {
    return { success: false };
  }
};

/**
 * Logout (no backend call needed, just for completeness)
 */
export const logout = async (): Promise<{ success: boolean }> => {
  try {
    await delay(300);
    logApiCall('POST', '/auth/logout', {}, { success: true });
    return { success: true };
  } catch {
    return { success: false };
  }
};

// ============================================================================
// DEMO DATA HELPERS
// ============================================================================

/**
 * Get all mock users (for debugging)
 */
export const getMockUsers = () => {
  return MOCK_USERS.map(({ password: removedPassword, ...user }) => {
    void removedPassword;
    return user;
  });
};

/**
 * Reset mock database (for testing)
 */
export const resetMockDatabase = () => {
  MOCK_USERS.length = 0;
  MOCK_USERS.push(
    {
      id: 'user_001',
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      company: 'Acme Corp',
      website: 'https://acme.com',
      phone: '+1 (555) 123-4567',
      createdAt: new Date('2024-01-15').toISOString(),
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: 'user_002',
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      password: 'securepass456',
      company: 'Tech Solutions',
      website: 'https://techsolutions.io',
      phone: '+1 (555) 987-6543',
      createdAt: new Date('2024-02-20').toISOString(),
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    {
      id: 'user_003',
      fullName: 'Demo User',
      email: 'demo@feedple.ai',
      password: 'demo123456',
      company: 'Feedple AI',
      website: 'https://feedple.ai',
      phone: '+1 (555) 456-7890',
      createdAt: new Date('2024-03-01').toISOString(),
      avatar: 'https://i.pravatar.cc/150?img=3',
    }
  );
  Object.keys(OTP_STORE).forEach((key) => delete OTP_STORE[key]);
};
