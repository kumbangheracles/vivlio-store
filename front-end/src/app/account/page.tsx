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
  searchParams?: {
    status?: string;
    page?: string;
    limit?: string;
    sortPrice?: "1" | "-1";
    sortDate?: "newest_saved" | "oldest_saved";
    pageWish?: string;
    limitWish?: string;
  };
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

  const pageWish = Number(params?.pageWish ?? 1);
  const limitWish = params?.limitWish ?? "5";
  const sortPrice = params?.sortPrice;
  const sortDate = params?.sortDate ?? "newest_saved";
  const dataWishlist = await fetchWishlist({
    pageWish: pageWish,
    limitWish: limitWish,
    sortPrice: sortPrice,
    sortDate: sortDate,
  });

  const dataUser = await fetchUser();
  return (
    <AccountIndex
      dataUser={dataUser as UserProperties}
      dataWishlist={dataWishlist}
      dataBookReviews={dataBookReviews}
      // fetchWishlist={fetchWishlist({
      //   page: pageWish,
      //   limit: limitWish,
      //   sortPrice,
      // })}
      fetchReviews={fetchBookReviews}
    />
  );
};

export default AccountPage;
