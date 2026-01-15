import AccountIndex from "@/components/Account";

import { UserProperties } from "@/types/user.type";
import fetchUser from "../actions/fetchUser";

import fetchWishlist from "../../components/Account/fetchWishlist";

export const metadata = {
  title: "ViviBook - Profile",
  description: "Profile page",
};

const AccountPage = async () => {
  const dataUser = await fetchUser();
  const dataWishlist = await fetchWishlist();
  return (
    <AccountIndex
      dataUser={dataUser as UserProperties}
      dataWishlist={dataWishlist}
      fetchWishlist={fetchWishlist}
    />
  );
};

export default AccountPage;
