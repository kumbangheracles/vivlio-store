import { ErrorHandler } from "@/helpers/handleError";
import myAxios from "@/libs/myAxios";
export default async function PostUser(identifier: string, password: string) {
  try {
    await myAxios.post("/auth/login", { identifier, password });
  } catch (error) {
    ErrorHandler(error);
  }
}
