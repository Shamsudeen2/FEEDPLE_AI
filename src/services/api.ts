import axios from 'axios';
import type { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';

// ============================================================================
// AXIOS INSTANCE SETUP
// ============================================================================

const API_BASE_URL = import.meta.env.DEV ? '/api/py/api/v1' : 'https://feedple-ai.onrender.com/api/py/api/v1';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});
// Add auth token to requests if it exists
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('feedple_auth_token');
    if (token && config && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper to refresh token using the backend endpoint
const refreshTokenWithApi = async (currentToken?: string | null): Promise<string | null> => {
  try {
    const tokenToUse = currentToken || localStorage.getItem('feedple_auth_token');
    if (!tokenToUse) return null;
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
      headers: {
        Authorization: `Bearer ${tokenToUse}`,
        'Content-Type': 'application/json',
      },
    });
    // backend may return token under data.token or data.data.token
    const newToken = response.data?.data?.token || response.data?.token;
    if (newToken) {
      localStorage.setItem('feedple_auth_token', newToken);
      return newToken;
    }
    return null;
  } catch (err) {
    console.warn('Token refresh failed', err);
    return null;
  }
};

// Handle responses and errors globally (attempt token refresh on 401)
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = (error.config as AxiosRequestConfig & { _retry?: boolean });
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      const currentToken = localStorage.getItem('feedple_auth_token');
      const newToken = await refreshTokenWithApi(currentToken ?? null);
      if (newToken) {
        // retry original request with new token
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      }
      // If refresh failed, clear storage and redirect to signin
      localStorage.removeItem('feedple_auth_token');
      localStorage.removeItem('feedple_auth_user');
      try {
        window.location.href = '/signin';
      } catch {
        // Handle error if redirect fails
      }
    }
    return Promise.reject(error);
  }
);

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface ApiErrorDetail {
  message?: string;
  code?: string;
  errors?: Array<{ field?: string; message?: string }>; 
}

export interface SignUpRequest {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  company_name: string;
  company_website?: string;
  industry?: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      email: string;
      full_name: string;
      company_name?: string;
      [key: string]: string | number | boolean | null | undefined;
    };
    token: string;
    expiresIn?: number;
  };
  error?: string;
  errorCode?: string;
  validationErrors?: Record<string, string>;
}

export interface SendOtpRequest {
  email: string;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  data?: {
    otpSent: true;
    email: string;
    expiresIn?: number;
  };
  error?: string;
  errorCode?: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      email: string;
      full_name: string;
      [key: string]: string | number | boolean | null | undefined;
    };
    token: string;
    expiresIn?: number;
  };
  error?: string;
  errorCode?: string;
}

export interface SignUpVerifyOtpRequest extends SignUpRequest {
  otp_code: string;
}

// ============================================================================
// AUTHENTICATION API CALLS
// ============================================================================

/**
 * Sign up with OTP verification
 * Verify signup data with OTP code
 */
export const signUpVerifyOtpWithApi = async (
  signUpData: SignUpVerifyOtpRequest
): Promise<AuthResponse> => {
  try {
    console.log('[API] POST /auth/signup/verify-otp', signUpData);
    const response = await apiClient.post('/auth/signup/verify-otp', signUpData);
    
    console.log('[API Response] Signup OTP verified:', response.data);
    return {
      success: true,
      message: 'Account created successfully',
      data: response.data.data,
    };
  } catch (error) {
    const axiosError = error as AxiosError<AuthResponse>;
    const errorResponse = axiosError.response?.data;
    
    console.error('[API Error] Signup OTP verification failed:', errorResponse || axiosError.message);
    
    // Handle validation errors from backend
    let errorMessage = 'Signup verification failed';
    let validationErrors: Record<string, string> | undefined;

    const mapBackendField = (field?: string) => {
      if (!field) return field;
      const fieldMap: Record<string, string> = {
        full_name: 'fullName',
        confirm_password: 'confirmPassword',
        company_name: 'companyName',
        company_website: 'companyWebsite',
        otp_code: 'otpCode',
      };
      return fieldMap[field] ?? field;
    };

    if (errorResponse?.error && errorResponse.error !== null && typeof errorResponse.error === 'object') {
      const errorDetail = errorResponse.error as ApiErrorDetail;
      if (errorDetail.message) {
        errorMessage = errorDetail.message;
      }
      if (errorDetail.errors && Array.isArray(errorDetail.errors)) {
        validationErrors = errorDetail.errors.reduce(
          (acc: Record<string, string>, item) => {
            if (item?.field && item?.message) {
              const fieldName = mapBackendField(item.field);
              if (fieldName) {
                acc[fieldName] = item.message;
              }
            }
            return acc;
          },
          {}
        );
        console.error('[Validation Errors]:', validationErrors);
      }
    } else if (errorResponse?.message) {
      errorMessage = errorResponse.message;
    }

    const errorDetail = errorResponse?.error as ApiErrorDetail;
    return {
      success: false,
      message: errorMessage,
      errorCode: errorDetail?.code || errorResponse?.errorCode || 'SIGNUP_VERIFY_OTP_ERROR',
      error: axiosError.message,
      validationErrors,
    };
  }
};

export const signUpWithApi = async (
  signUpData: SignUpRequest
): Promise<AuthResponse> => {
  try {
    console.log('[API] POST /auth/signup', signUpData);
    const response = await apiClient.post('/auth/signup', signUpData);
    
    console.log('[API Response] Sign up successful:', response.data);
    return {
      success: true,
      message: 'Account created successfully',
      data: response.data.data,
    };
  } catch (error) {
    const axiosError = error as AxiosError<AuthResponse>;
    const errorResponse = axiosError.response?.data;
    
    console.error('[API Error] Sign up failed:', errorResponse || axiosError.message);
    
    // Handle validation errors from backend
    let errorMessage = 'Sign up failed';
    let validationErrors: Record<string, string> | undefined;

    const mapBackendField = (field?: string) => {
      if (!field) return field;
      const fieldMap: Record<string, string> = {
        full_name: 'fullName',
        confirm_password: 'confirmPassword',
        company_name: 'companyName',
        company_website: 'companyWebsite',
      };
      return fieldMap[field] ?? field;
    };

    if (errorResponse?.error && errorResponse.error !== null && typeof errorResponse.error === 'object') {
      const errorDetail = errorResponse.error as ApiErrorDetail;
      if (errorDetail.message) {
        errorMessage = errorDetail.message;
      }
      if (errorDetail.errors && Array.isArray(errorDetail.errors)) {
        validationErrors = errorDetail.errors.reduce(
          (acc: Record<string, string>, item) => {
            if (item?.field && item?.message) {
              const fieldName = mapBackendField(item.field);
              if (fieldName) {
                acc[fieldName] = item.message;
              }
            }
            return acc;
          },
          {}
        );
        console.error('[Validation Errors]:', validationErrors);
      }
    } else if (errorResponse?.message) {
      errorMessage = errorResponse.message;
    }

    const errorDetail = errorResponse?.error as ApiErrorDetail;
    return {
      success: false,
      message: errorMessage,
      errorCode: errorDetail?.code || errorResponse?.errorCode || 'SIGNUP_ERROR',
      error: axiosError.message,
      validationErrors,
    };
  }
};

/**
 * Sign in with email and password
 */
export const signInWithApi = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    console.log('[API] POST /auth/login', { email });
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });

    console.log('[API Response] Sign in successful:', response.data);
    return {
      success: true,
      message: 'Signed in successfully',
      data: response.data.data ?? response.data,
    };
  } catch (error) {
    const axiosError = error as AxiosError<AuthResponse>;
    console.error('[API Error] Incorrect email address or password:', axiosError.response?.data || axiosError.message);

    // Map common error codes
    let message = axiosError.response?.data?.message || 'Incorrect email address or password';
    if (axiosError.response?.status === 401) {
      message = 'Invalid email or password';
    }

    return {
      success: false,
      message,
      errorCode: axiosError.response?.data?.errorCode || 'SIGNIN_ERROR',
      error: axiosError.message,
    };
  }
};

/**
 * Send OTP to email for email-based login
 */
export const sendOtpWithApi = async (email: string): Promise<SendOtpResponse> => {
  try {
    console.log('[API] POST /auth/login/email', { email });
    const response = await apiClient.post('/auth/login/email', { email });

    console.log('[API Response] Email login OTP request:', response.data);
    return {
      success: true,
      message: response.data.message || 'OTP sent to your email',
      data: response.data.data,
    };
  } catch (error) {
    const axiosError = error as AxiosError<SendOtpResponse>;
    console.error('[API Error] Email login OTP request failed:', axiosError.response?.data || axiosError.message);

    return {
      success: false,
      message: axiosError.response?.data?.message || 'Failed to send OTP',
      errorCode: axiosError.response?.data?.errorCode || 'SEND_OTP_ERROR',
      error: axiosError.message,
    };
  }
};

/**
 * Verify OTP sent for email-based login
 */
export const verifyOtpWithApi = async (
  email: string,
  otp: string
): Promise<VerifyOtpResponse> => {
  try {
    console.log('[API] POST /auth/login/verify-otp', { email, otp_code: otp });
    const response = await apiClient.post('/auth/login/verify-otp', {
      email,
      otp_code: otp,
    });

    console.log('[API Response] Email login OTP verified:', response.data);
    return {
      success: true,
      message: response.data.message || 'OTP verified successfully',
      data: response.data.data ?? response.data,
    };
  } catch (error) {
    const axiosError = error as AxiosError<VerifyOtpResponse>;
    console.error('[API Error] Email login OTP verification failed:', axiosError.response?.data || axiosError.message);

    return {
      success: false,
      message: axiosError.response?.data?.message || 'OTP verification failed',
      errorCode: axiosError.response?.data?.errorCode || 'VERIFY_OTP_ERROR',
      error: axiosError.message,
    };
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get current user from token (for session restoration)
 */
export const getCurrentUserWithApi = async (
  token: string
): Promise<{ success: boolean; user?: { id: string; email: string; full_name: string; [key: string]: string | number | boolean | null | undefined } }> => {
  try {
    console.log('[API] GET /auth/me');
    const response = await apiClient.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }); 

    return {
      success: true,
      user: response.data.data,
    };
  } catch (error) {
    console.error('[API Error] Get current user failed:', error);
    return { success: false };
  }
};

/**
 * Logout
 */
export const logoutWithApi = async (): Promise<{ success: boolean }> => {
  try {
    console.log('[API] POST /auth/logout');
    // Include token if available (some backends require Authorization header)
    const token = localStorage.getItem('feedple_auth_token');
    await apiClient.post(
      '/auth/logout',
      {},
      token
        ? {
            headers: { Authorization: `Bearer ${token}` },
          }
        : undefined,
    );
    return { success: true };
  } catch (error) {
    console.error('[API Error] Logout failed:', error);
    // Return success anyway to clear local state
    return { success: true };
  }
};

export default apiClient;
