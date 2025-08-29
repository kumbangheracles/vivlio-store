"use client";
import { Card, Row, Tabs } from "antd";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import Account from "./Account";
import { UserProperties } from "@/types/user.type";
import Wishlist from "./Wishlist";
import { BookWithWishlist } from "@/types/wishlist.type";

interface AccountProps {
  dataUser?: UserProperties;
  dataWishlist?: BookWithWishlist[];
  fetchWishlist: () => void;
}

const AccountIndex: React.FC<AccountProps> = ({
  dataUser,
  dataWishlist,
  fetchWishlist,
}) => {
  const LOCAL_STORAGE_KEY = "lastActiveTabKey";
  const [activeTab, setActiveTab] = useState("account");
  useEffect(() => {
    const savedTab = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    localStorage.setItem(LOCAL_STORAGE_KEY, key);
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
          <h1>Transaction Page</h1>
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
      label: <LabelText>Address</LabelText>,
      key: "address",
      children: (
        <>
          <h1>Address Page</h1>
        </>
      ),
    },
  ];
  return (
    <CardContainer>
      <Tabs
        tabPosition="left"
        activeKey={activeTab}
        items={tabItems}
        onChange={handleTabChange}
      />
    </CardContainer>
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
`;
