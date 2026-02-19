import { getServerSession } from "next-auth";
import { API_URL } from "@/libs/myAxios";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { BaseResponBook } from "@/types/base.type";
import { TransactionParams, TransactionProps } from "@/types/transaction.type";

async function fetchTransactions({
  limitOrders = "0",
  orderStatus = "",
  page = 1,
  title = "",
  sortDateOrders = "",
}: TransactionParams = {}): Promise<BaseResponBook<TransactionProps>> {
  const session = await getServerSession(authOptions);

  try {
    const params = new URLSearchParams({
      page: page.toString(),
      userId: session?.user?.id as string,
    });

    if (title) {
      params.append("title", title);
    }

    if (limitOrders) {
      params.append("limit", limitOrders);
    }

    if (orderStatus) {
      params.append("status", orderStatus);
    }
    if (sortDateOrders) {
      params.append("sortDateOrders", sortDateOrders);
    }

    const res = await fetch(`${API_URL}/transactions?${params}`, {
      headers: session?.accessToken
        ? { Authorization: `Bearer ${session?.accessToken}` }
        : {},
      cache: "no-store",
    });

    const data = res.json();
    // console.log("Res Trans:", res);
    return data;
  } catch (error) {
    console.log("Error fetch transaction: ", error);
    throw error;
  }
}

export default fetchTransactions;
