export type UserProperties = {
  id?: string;
  fullName?: string;
  username?: string;
  password?: string;
  email?: string;
  role?: string | number;
  confirmPassword?: string;
  verificationCode?: string;
};

export const ERole = {
  ADMIN: "admin",
  CUSTOMER: "customer",
} as const;

export type LoginProps = Pick<UserProperties, "password"> & {
  identifier?: string;
};

export const initialLogin: LoginProps = {
  identifier: "",
  password: "",
};

export const initialUser: UserProperties = {
  id: "",
  fullName: "",
  username: "",
  password: "",
  confirmPassword: "",
  role: ERole.ADMIN,
};
