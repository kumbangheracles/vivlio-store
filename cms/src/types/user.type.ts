export type UserProperties = {
  id?: string;
  fullName?: string;
  username?: string;
  password?: string;
  email?: string;
  roleId?: string;
  confirmPassword?: string;
  verificationCode?: string;
  token?: string;
};

export const ERole = {
  ADMIN: "admin",
  CUSTOMER: "customer",
} as const;

export enum EUserRole {
  ADMIN = "admin",
  CUSTOMER = "customer",
}

export type LoginProps = Pick<UserProperties, "password"> & {
  identifier?: string;
};

export const initialLogin: LoginProps = {
  identifier: "herkal@admin.com",
  password: "admin123",
};

export const initialUser: UserProperties = {
  id: "",
  fullName: "",
  username: "",
  password: "",
  confirmPassword: "",
  roleId: "",
};
