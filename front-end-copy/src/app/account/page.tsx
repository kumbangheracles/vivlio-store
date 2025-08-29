import AccountIndex from "@/components/Account";
import AppLayout from "@/components/Layout";
import myAxios from "@/libs/myAxios";
import { UserProperties } from "@/types/user.type";
import { fetchUser } from "../actions/fetchUser";
import { BookWithWishlist } from "@/types/wishlist.type";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import fetchWishlist from "../../components/Account/fetchWishlist";

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
