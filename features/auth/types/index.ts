export type TSignUpBody = {
  email: string
  password: string
  data: {
    name: string
    job_title: string
  }
}

export type TSignInBody = {
  email: string
  password: string
}

export interface AuthUser {
  id: string
  email: string
  user_metadata: {
    name: string
    department: string
  }
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  user: AuthUser
}

export type TRefreshTokenBody = {
  refresh_token: string
}

export type TCurrentUserBody = {
  id: string
  email: string
  name: string
  department: string
  role: string
}

export type TForgotPassword = {
  email: string
}

export type ApiError = {
  code: number
  error_code: string
  msg: string
}

export type UserMetadata = {
  // email: string
  // email_verified: boolean
  department: string
  name: string
  // phone_verified: boolean
  // sub: string
}

export type User = {
  id: string
  email: string
  role: string
  user_metadata: UserMetadata
  created_at: string
  last_sign_in_at: string
}
