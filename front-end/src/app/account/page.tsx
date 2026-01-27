import AccountIndex from "@/components/Account";

import { UserProperties } from "@/types/user.type";
import fetchUser from "../actions/fetchUser";

import fetchWishlist from "../../components/Account/fetchWishlist";
import fetchBookReviews from "../actions/fetchBookReviews";

export const metadata = {
  title: "ViviBook - Profile",
  description: "Profile page",
};

const AccountPage = async () => {
  const dataUser = await fetchUser();
  const dataWishlist = await fetchWishlist();
  const dataBookReviews = await fetchBookReviews();
  return (
    <AccountIndex
      dataUser={dataUser as UserProperties}
      dataWishlist={dataWishlist}
      dataBookReviews={dataBookReviews}
      fetchWishlist={fetchWishlist}
    />
  );
};

export default AccountPage;
