import fetchTransactions from "@/app/actions/fetchTransactions";
import TransactionMobileIndex from "@/components/Account/mobile/TransactionMobile";
interface Params {
  searchParams?: {
    status?: string;
    page?: string;
    limit?: string;
    sortPrice?: "1" | "-1";
    sortDate?: "newest_saved" | "oldest_saved";

    // wishlist
    pageWish?: string;
    limitWish?: string;

    // transactions
    orderStatus?: string;
    limitOrders?: string;
    sortDateOrders?: string;
    sortPriceOrders?: string;
    titleOrders?: string;
  };
}
const TransactionMobilePage = async ({ searchParams }: Params) => {
  const params = await searchParams;
  const dataTransaction = await fetchTransactions({
    limitOrders: params?.limitOrders?.toString() ?? "6",
    orderStatus: params?.orderStatus,
    sortDateOrders: params?.sortDateOrders,
    title: params?.titleOrders,
  });
  return <TransactionMobileIndex dataTransactions={dataTransaction?.results} />;
};

export default TransactionMobilePage;
