import fetchWishlist from "@/components/Account/fetchWishlist";
import WishlistMobile from "@/components/Account/mobile/WishlistMobile";
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
const WishlistMobilePage = async ({ searchParams }: Params) => {
  const params = await searchParams;
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
  return <WishlistMobile dataWishlists={dataWishlist} />;
};

export default WishlistMobilePage;
