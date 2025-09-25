import RegisterForm from "@/components/Auth/register";
import AppLayout from "@/components/Layout";
import AuthProvider from "@/context/AuthProvider";

export default async function RegisterPage() {
  return (
    <>
      {/* <AppLayout isAuthPageTampil={true}> */}
      {/* <AuthProvider> */}
      <RegisterForm />
      {/* </AuthProvider> */}
      {/* </AppLayout> */}
    </>
  );
}
