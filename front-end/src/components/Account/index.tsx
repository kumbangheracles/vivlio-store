"use client";
import { Card, Row, Tabs } from "antd";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import Account from "./Account";
import { UserProperties } from "@/types/user.type";
import Wishlist from "./Wishlist";
import { BookWithWishlist } from "@/types/wishlist.type";
import useDeviceType from "@/hooks/useDeviceType";
import Image from "next/image";
import BackgroundMobile from "../Account/assets/background-mobile.png";
import DefaultImage from "../../assets/images/profile-default.jpg";
import {
  FileDoneOutlined,
  HeartOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { FaRegMap } from "react-icons/fa";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const LOCAL_STORAGE_KEY = "lastActiveTabKey";
  const isMobile = useDeviceType();
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

  const listSection = [
    {
      id: 1,
      title: "Transaction",
      icon: <FileDoneOutlined />,
      path: "/account/transaction",
    },
    {
      id: 2,
      title: "Wishlist",
      icon: <HeartOutlined />,
      path: "/account/wishlist",
    },
    {
      id: 3,
      title: "Address",
      icon: <FaRegMap />,
      path: "/account/address",
    },
    {
      id: 4,
      title: "Account",
      icon: <UserOutlined />,
      path: "/account/profile",
    },
    {
      id: 5,
      title: "Transaction",
      icon: <FileDoneOutlined />,
      path: "/account/transaction",
    },
  ];
  return (
    <>
      {isMobile ? (
        <div>
          <div className="fixed top-0 bg-white shadow-sm w-full px-3 py-3 z-[999]">
            <h4 className="text-sm font-bold tracking-wide">Account</h4>
          </div>

          <div
            className="relative flex w-full mt-[-17px] justify-center bg-[url('/images/background-mobile.png')] 
                bg-cover bg-center h-[140px]"
          >
            <div className="absolute bottom-[10px] flex items-center justify-center flex-col ">
              <div
                className=" flex items-center justify-center 
              w-[85px] h-[85px] rounded-full overflow-hidden 
              border-4 border-white bg-white"
              >
                <Image
                  width={100}
                  height={100}
                  src={dataUser?.profileImage?.imageUrl || DefaultImage}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>

              <h4 className="font-semibold tracking-wide text-sm">
                {dataUser?.fullName}
              </h4>
              <h4 className="font-normal text-gray-600 tracking-wide text-[12px]">
                {dataUser?.email}
              </h4>
            </div>
          </div>

          <div className="p-4 flex flex-col gap-2">
            <>
              {listSection.map((item) => (
                <div
                  className="flex items-center gap-3 p-2 active:bg-gray-200 rounded-md"
                  key={item.id}
                  onClick={() => router.push(item.path)}
                >
                  {item.icon}
                  <h4 className="font-normal tracking-wide text-[12px]">
                    {item.title}
                  </h4>
                </div>
              ))}
            </>

            <div className="flex items-center gap-3 p-2 active:bg-gray-200 rounded-md">
              <LogoutOutlined />
              <h4 className="font-normal tracking-wide text-[12px]">Log Out</h4>
            </div>
          </div>
        </div>
      ) : (
        <CardContainer>
          <Tabs
            // destroyInactiveTabPane
            destroyOnHidden
            key={activeTab}
            tabPosition="left"
            activeKey={activeTab}
            items={tabItems}
            onChange={handleTabChange}
          />
        </CardContainer>
      )}
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
`;
