import AccountIndex from "@/components/Account";
import AppLayout from "@/components/Layout";
import myAxios from "@/libs/myAxios";
import { UserProperties } from "@/types/user.type";
import { fetchUser } from "../actions/fetchUser";

const AccountPage = async () => {
  const dataUser = await fetchUser();
  return (
    <AppLayout>
      <AccountIndex dataUser={dataUser!} />
    </AppLayout>
  );
};

export default AccountPage;
