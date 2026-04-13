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
