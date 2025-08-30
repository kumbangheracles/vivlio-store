export type UserProperties = {
  id?: string;
  fullName?: string;
  username?: string;
  password?: string;
  email?: string;
  roleId?: string;
  roleName?: string;
  confirmPassword?: string;
  verificationCode?: string;
  token?: string;
  isActive?: boolean;
  profileImage?: any;
  role?: string;
};

export type UserImage = {
  userId: string;
  imageUrl: string;
  public_id: string;
};

export const ERole = {
  ADMIN: "admin",
  CUSTOMER: "customer",
  SUPER_ADMIN: "super_admin",
} as const;

export enum EUserRole {
  ADMIN = "admin",
  CUSTOMER = "customer",
  SUPER_ADMIN = "super_admin",
}

export type LoginProps = Pick<UserProperties, "password"> & {
  identifier?: string;
  id?: string;
};

export const initialLogin: LoginProps = {
  identifier: "herkalsuper@admin.com",
  password: "superadmin123",
};

export const initialUser: UserProperties = {
  id: "",
  fullName: "",
  username: "",
  password: "",
  confirmPassword: "",
  roleId: "",
  isActive: false,
  roleName: "",
};
