"use client";
import { Card, Tabs } from "antd";
import { startTransition, useEffect, useState } from "react";
import { styled } from "styled-components";
import Account from "./Account";
import { UserProperties } from "@/types/user.type";
import Wishlist from "./Wishlist";
import { BookWithWishlist } from "@/types/wishlist.type";
import { useSearchParams } from "next/navigation";
import BookReviews from "./BookReviews";
import { BookReviewsProps } from "@/types/bookreview.type";
import useGlobalLoadingBar from "@/hooks/useGlobalLoadingBar";
import NotFoundPage from "../NotFoundPage";
import { useMounted } from "@/hooks/useMounted";
import GlobalLoading from "../GlobalLoading";
import TransactionIndex from "./Transaction";
import { TransactionProps } from "@/types/transaction.type";
interface AccountProps {
  dataUser?: UserProperties;
  dataWishlist?: BookWithWishlist[];
  fetchWishlist?: () => void;
  dataBookReviews?: BookReviewsProps[];
  fetchReviews?: () => void;
  dataTransaction?: TransactionProps[];
}
type TabKey = "account" | "wishlist" | "transaction" | "book-reviews";
const AccountIndex: React.FC<AccountProps> = ({
  dataUser,
  dataBookReviews,
  dataWishlist,
  fetchWishlist,
  fetchReviews,
  dataTransaction,
}) => {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("key") as TabKey) || "account";
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const { handleReplaceRoute } = useGlobalLoadingBar();

  const handleTabChange = (key: string) => {
    setActiveTab(key as TabKey);
  };

  const tabItems = [
    {
      label: <LabelText>Account</LabelText>,
      key: "account",
      children: (
        <>
          <Account dataUser={dataUser} />
        </>
      ),
    },
    {
      label: <LabelText>Transaction</LabelText>,
      key: "transaction",
      children: (
        <>
          <TransactionIndex
            dataTransactions={dataTransaction as TransactionProps[]}
          />
        </>
      ),
    },
    {
      label: <LabelText>Wishlist</LabelText>,
      key: "wishlist",
      children: (
        <>
          <Wishlist dataWish={dataWishlist} fetchWishlist={fetchWishlist} />
        </>
      ),
    },

    {
      label: <LabelText>Books Reviews</LabelText>,
      key: "books_reviews",
      // onclick: ()=> ,
      children: (
        <>
          <BookReviews
            fetchReviews={fetchReviews}
            bookReviews={dataBookReviews as BookReviewsProps[]}
          />
        </>
      ),
    },
  ];

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("key", activeTab);

    const url = `?key=${activeTab}`;

    startTransition(() => {
      handleReplaceRoute(url, { scroll: false });
    });
  }, [activeTab]);

  const mounted = useMounted();

  if (!mounted) return <GlobalLoading />;
  return (
    <>
      <div className="sm:hidden block">
        <NotFoundPage />
      </div>
      <div className="sm:block hidden">
        <CardContainer>
          <Tabs
            // destroyInactiveTabPane
            destroyOnHidden
            key={activeTab}
            tabPosition="left"
            activeKey={activeTab}
            items={tabItems}
            onChange={handleTabChange}
            tabBarStyle={{ width: 200 }}
          />
        </CardContainer>
      </div>
    </>
  );
};

export default AccountIndex;

const CardContainer = styled(Card)`
  padding: 10px;
  margin-inline: 1rem;

  margin-block: 100px;
  /* width: 100%; */
  border: none;
`;
const LabelText = styled.h1`
  font-weight: 600;
  font-size: 16;
  letter-spacing: 0.5px;
`;
