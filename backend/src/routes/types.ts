export type ApiError =
  | 'UsernameAlreadyTaken'
  | 'EmailAlreadyInUse'
  | 'ValidationError'
  | 'UserNotFound'
  | 'ServerError';

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
