import fetchWishlist from "@/components/Account/fetchWishlist";
import WishlistMobile from "@/components/Account/mobile/WishlistMobile";

const WishlistMobilePage = async () => {
  const dataWishlist = await fetchWishlist();
  return <WishlistMobile dataWishlists={dataWishlist} />;
};

export default WishlistMobilePage;
