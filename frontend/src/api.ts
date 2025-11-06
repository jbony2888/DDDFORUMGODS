// API configuration
const API_BASE_URL = 'http://localhost:3001';

// Types
export interface ApiResponse<T> {
  status: number;
  data: {
    error?: string;
    data?: T;
    success: boolean;
    message?: string;
  };
  success: boolean;
}

export interface UserData {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
}

export interface UserDTO {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
}

interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

/**
 * Make API request to backend
 */
async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    return {
      status: response.status,
      data,
      success: response.ok,
    };
  } catch (error) {
    const err = error as Error;
    return {
      status: 0,
      data: { error: 'Network error', message: err.message, success: false },
      success: false,
    };
  }
}

/**
 * Create a new user
 */
export async function createUser(userData: UserData): Promise<ApiResponse<UserDTO>> {
  return apiRequest<UserDTO>('/users/new', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<ApiResponse<UserDTO>> {
  return apiRequest<UserDTO>(`/users?email=${encodeURIComponent(email)}`);
}

/**
 * Edit user
 */
export async function editUser(userId: number, userData: Partial<UserData>): Promise<ApiResponse<UserDTO>> {
  return apiRequest<UserDTO>(`/users/edit/${userId}`, {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

/**
 * Display error message
 */
export function showError(message: string): void {
  // Remove existing error messages
  const existingError = document.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }

  // Create error message element
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.style.cssText = 'color: red; padding: 10px; margin: 10px 0; background: #ffe6e6; border: 1px solid red; border-radius: 4px;';
  errorDiv.textContent = message;

  // Insert before the form
  const form = document.querySelector('.registration-form');
  if (form) {
    form.insertBefore(errorDiv, form.firstChild);
  }
}

/**
 * Display success message
 */
export function showSuccess(message: string): void {
  // Remove existing messages
  const existingMessage = document.querySelector('.success-message');
  if (existingMessage) {
    existingMessage.remove();
  }

  // Create success message element
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.style.cssText = 'color: green; padding: 10px; margin: 10px 0; background: #e6ffe6; border: 1px solid green; border-radius: 4px;';
  successDiv.textContent = message;

  // Insert before the form
  const form = document.querySelector('.registration-form');
  if (form) {
    form.insertBefore(successDiv, form.firstChild);
  }
}

