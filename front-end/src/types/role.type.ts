export type RoleProperties = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string; // ISO timestamp
  updatedAt: string;
};
const initialRole: RoleProperties = {
  id: "",
  name: "",
  description: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
