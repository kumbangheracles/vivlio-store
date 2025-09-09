import AccountIndex from "@/components/Account";
import AppLayout from "@/components/Layout";

import { UserProperties } from "@/types/user.type";
import { fetchUser } from "../actions/fetchUser";

import fetchWishlist from "../../components/Account/fetchWishlist";

export const metadata = {
  title: "Vivlio - Profile",
  description: "Profile page",
};

const AccountPage = async () => {
  const dataUser = await fetchUser();
  const dataWishlist = await fetchWishlist();
  return (
    <AppLayout>
      <AccountIndex
        dataUser={dataUser as UserProperties}
        dataWishlist={dataWishlist}
        fetchWishlist={fetchWishlist}
      />
    </AppLayout>
  );
};

export default AccountPage;
