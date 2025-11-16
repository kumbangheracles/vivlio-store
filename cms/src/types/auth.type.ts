import type { BaseResponseProps } from "./base.type";
import type { UserProperties, EUserRole } from "./user.type";

type EAuthStatus = "LOGGED_IN" | "LOGGED_OUT";
export interface ILoginData {
  email: string;
  password: string;
}

export type AuthProps = {
  id?: string;
  identifier?: string;
  password?: string;
  role?: string;
  username?: string;
};

export type AuthState = {
  status: EAuthStatus;
  user: UserProperties;
  role: EUserRole;
};

export interface SignInProps {
  email: string;
  password: string;
}

export interface ForgotPasswordProps {
  email: string;
}

export interface ResetPasswordProps {
  newPassword: string;
}

export interface SignInResponseProps
  extends BaseResponseProps<{
    token: string;
  }> {}

export interface ForgotPasswordResponseProps
  extends BaseResponseProps<{
    email: string;
    isSuccess: boolean;
  }> {}

export interface ResetPasswordResponseProps
  extends BaseResponseProps<{
    isSuccess: boolean;
  }> {}
