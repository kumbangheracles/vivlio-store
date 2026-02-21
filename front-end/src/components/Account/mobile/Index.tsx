"use client";
import { ErrorHandler } from "@/helpers/handleError";
import useGlobalLoadingBar from "@/hooks/useGlobalLoadingBar";
import myAxios from "@/libs/myAxios";
import { UserProperties } from "@/types/user.type";
import {
  FileDoneOutlined,
  HeartOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import DefaultImg from "../../../assets/images/default-img.png";
import { message, Modal } from "antd";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { FaRegMap } from "react-icons/fa";
import { MdOutlineRateReview } from "react-icons/md";
import NotFoundPage from "@/components/NotFoundPage";
import { useMounted } from "@/hooks/useMounted";
import GlobalLoading from "@/components/GlobalLoading";
import { useAuth } from "@/hooks/useAuth";

interface PropTypes {
  dataUser: UserProperties;
}

const AccountMobilePage = ({ dataUser }: PropTypes) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { handlePushRoute, handleReplaceRoute } = useGlobalLoadingBar();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const auth = useAuth();

  if (!auth?.accessToken) {
    message.info("You must login first!.");
    handleReplaceRoute("/auth/login");
  }
  const listSection = [
    {
      id: 1,
      title: "Transaction",
      icon: <FileDoneOutlined />,
      path: "/account-mobile/transactions",
    },
    {
      id: 2,
      title: "Wishlist",
      icon: <HeartOutlined />,
      path: "/account-mobile/wishlist",
    },
    {
      id: 3,
      title: "Reviews",
      icon: <MdOutlineRateReview />,
      path: "/account-mobile/book-reviews",
    },

    {
      id: 5,
      title: "Account",
      icon: <UserOutlined />,
      path: "/account-mobile/profile",
    },
  ];

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await myAxios.post("/auth/logout");
      message.info("Logout Success");
      await signOut({
        callbackUrl: "/auth/login",
      });
    } catch (error) {
      ErrorHandler(error);
      await signOut({
        callbackUrl: "/auth/login",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const mounted = useMounted();

  if (!mounted) return <GlobalLoading />;
  return (
    <>
      <div className="hidden sm:block">
        <NotFoundPage />
      </div>
      <div className="sm:hidden">
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
                src={dataUser?.profileImage?.imageUrl || DefaultImg}
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
                onClick={() => handlePushRoute(item.path)}
              >
                {item.icon}
                <h4 className="font-normal tracking-wide text-[12px]">
                  {item.title}
                </h4>
              </div>
            ))}
          </>

          <div
            className="flex items-center gap-3 p-2 active:bg-gray-200 rounded-md"
            onClick={() => setIsOpen(true)}
          >
            <LogoutOutlined />
            <h4 className="font-normal tracking-wide text-[12px]">Log Out</h4>
          </div>
        </div>

        <Modal
          open={isOpen}
          okText="Yes"
          cancelText="Cancel"
          onCancel={() => setIsOpen(false)}
          onOk={handleLogout}
          confirmLoading={isLoading}
          title={<h1 className="text-center font-bold">Logout</h1>}
          centered
        >
          <div className="text-center">
            <h1>Are you sure you want to logout?</h1>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default AccountMobilePage;
