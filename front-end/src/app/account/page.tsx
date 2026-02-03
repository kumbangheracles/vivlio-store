import AccountIndex from "@/components/Account";

import { UserProperties } from "@/types/user.type";
import fetchUser from "../actions/fetchUser";

import fetchWishlist from "../../components/Account/fetchWishlist";
import fetchBookReviews from "../actions/fetchBookReviews";
import { BookReviewStatus } from "@/types/bookreview.type";

export const metadata = {
  title: "ViviBook - Profile",
  description: "Profile page",
};

interface Params {
  searchParams: Promise<{
    status?: string;
    page?: string;
    limit?: string;
  }>;
}

const AccountPage = async ({ searchParams }: Params) => {
  const params = await searchParams;
  const status = params?.status ?? "";
  const page = Number(params?.page ?? 1);
  const limit = params?.limit ?? "6";
  const dataBookReviews = await fetchBookReviews({
    page,
    status: status as BookReviewStatus,
    limit: limit.toString(),
  });
  const dataUser = await fetchUser();
  const dataWishlist = await fetchWishlist();
  return (
    <AccountIndex
      dataUser={dataUser as UserProperties}
      dataWishlist={dataWishlist}
      dataBookReviews={dataBookReviews}
      fetchWishlist={fetchWishlist}
      fetchReviews={fetchBookReviews}
    />
  );
};

export default AccountPage;
