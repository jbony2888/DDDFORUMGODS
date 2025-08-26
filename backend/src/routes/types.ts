export const Errors = {
  UsernameAlreadyTaken: 'UsernameAlreadyTaken',
  EmailAlreadyInUse: 'EmailAlreadyInUse',
  ValidationError: 'ValidationError',
  ServerError: 'ServerError',
  ClientError: 'ClientError',
  UserNotFound: 'UserNotFound',
} as const;

export type ApiError = (typeof Errors)[keyof typeof Errors];

export interface ApiResponse<T> {
  error: ApiError | undefined;
  data: T | undefined;
  success: boolean;
}

export interface UserDTO {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
}
