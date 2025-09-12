import LoginForm from "@/components/Auth";
import AppLayout from "@/components/Layout";
import AuthProvider from "@/context/AuthProvider";

export default async function LoginPage() {
  return (
    <>
      {/* <AppLayout isAuthPageTampil={true}> */}
      {/* <AuthProvider> */}
      <LoginForm />
      {/* </AuthProvider> */}
      {/* </AppLayout> */}
    </>
  );
}
