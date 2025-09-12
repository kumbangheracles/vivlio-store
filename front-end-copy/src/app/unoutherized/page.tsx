import AppLayout from "@/components/Layout";
import UnauthorizedPage from "@/components/Unoutherized";
export default async function Unoutherized() {
  return (
    <>
      {/* <AppLayout isAuthPageTampil={false}> */}
      <UnauthorizedPage />
      {/* </AppLayout> */}
    </>
  );
}
