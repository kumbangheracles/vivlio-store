"use client";
import GlobalLoading from "@/components/GlobalLoading";
import NotFoundPage from "@/components/NotFoundPage";
import useDeviceType from "@/hooks/useDeviceType";
import { useMounted } from "@/hooks/useMounted";
import { UserProperties } from "@/types/user.type";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DefaultImage from "../../../assets/images/profile-default.jpg";
import { Button, Divider, Empty } from "antd";
import { useEffect, useState } from "react";
import OverlayModal from "./OverlayModal";
import { CategoryProps } from "@/types/category.types";
interface PropTypes {
  dataUser: UserProperties;
  dataCategory: CategoryProps[];
}
export type FormKey = "fullName" | "password" | "preference" | "username";
const AccountMobileIndex = ({ dataUser, dataCategory }: PropTypes) => {
  const router = useRouter();
  const isMobile = useDeviceType();
  const [overlay, setIsOverlay] = useState<boolean>(false);
  const [key, setKey] = useState<FormKey | null>(null);
  const mounted = useMounted();
  const handleOpenForm = (key: FormKey | null, type: "open" | "close") => {
    if (type === "open") {
      setIsOverlay(true);
      setKey(key);
    } else if (type === "close") {
      setIsOverlay(false);
      setKey(null);
    }
  };

  // useEffect(() => {
  //   console.log("Key: ", key);
  //   console.log("Overlay: ", overlay);
  // }, [key, overlay]);

  if (!isMobile) return <NotFoundPage />;
  if (!mounted) return <GlobalLoading />;

  return (
    <div>
      <div className="fixed top-0 bg-white shadow-sm justify-between flex w-full px-3 py-4 z-[30]">
        <div className="flex items-center gap-2">
          <ArrowLeftOutlined onClick={() => router.back()} />
          <h4 className="text-sm font-bold tracking-wide">Account</h4>
        </div>
      </div>

      <div>
        <div className="w-[150px] h-[150px] m-auto rounded-full overflow-hidden">
          <Image
            src={dataUser?.profileImage?.imageUrl || DefaultImage}
            alt={`img-${dataUser?.username}`}
            width={500}
            height={500}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="mt-[14px] flex items-center justify-center">
          <Button>Change Profile Picture</Button>
        </div>
      </div>

      <div className="p-4 mt-4">
        <h4 className="font-semibold text-sm">Profile Setting</h4>

        <div className="mt-4 flex flex-col gap-4">
          {/* Full Name */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h4 className="font-medium text-[12px] text-gray-500">
                Full Name
              </h4>
              <h4 className="font-semibold text-[10px]">
                {dataUser?.fullName}
              </h4>
            </div>
            <EditOutlined onClick={() => handleOpenForm("fullName", "open")} />
          </div>
          {/* Username */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h4 className="font-medium text-[12px] text-gray-500">
                Username
              </h4>
              <h4 className="font-semibold text-[10px]">
                {dataUser?.username}
              </h4>
            </div>
            <EditOutlined onClick={() => handleOpenForm("username", "open")} />
          </div>
          {/* Email */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h4 className="font-medium text-[12px] text-gray-500">Email</h4>
              <h4 className="font-semibold text-[10px]">{dataUser?.email}</h4>
            </div>
          </div>
          {/* Password */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h4 className="font-medium text-[12px] text-gray-500">
                Password
              </h4>
              <h4 className="font-semibold text-[13px]">
                {(dataUser?.password?.length as number) > 10
                  ? "**********"
                  : "*".repeat(dataUser?.password?.length as number)}
              </h4>
            </div>
            <EditOutlined onClick={() => handleOpenForm("password", "open")} />
          </div>
        </div>
      </div>
      <div className="p-4">
        <Divider className="!mt-[-15px] !mb-[-20px] !px-4 !bg-gray-300" />
      </div>

      <div className="p-4 !mt-[-30px]">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm">Preference</h4>
          <EditOutlined onClick={() => handleOpenForm("preference", "open")} />
        </div>
        <div className="flex flex-wrap gap-1 justify-center  mt-4">
          {dataUser?.category_preference?.length === 0 ||
          dataUser?.category_preference === null ? (
            <div className="flex items-center justify-center w-full">
              <Empty />
            </div>
          ) : (
            <>
              {dataUser?.category_preference?.map((item) => (
                <h4
                  key={item?.categoryId}
                  className="p-3 tracking-wider bg-gray-100 text-sm flex justify-center items-center !min-w-[90px] rounded-2xl text-[11px] sm:text-sm active:bg-sky-100"
                >
                  {item?.name}
                </h4>
              ))}
            </>
          )}
        </div>
      </div>

      {overlay && (
        <div
          onClick={() => handleOpenForm(null, "close")}
          className="inset-0 bg-black/50 transition-opacity duration-300 top-0 left-0 fixed h-screen w-screen z-[40]"
        ></div>
      )}

      {overlay && (
        <OverlayModal
          dataCategory={dataCategory}
          dataUser={dataUser}
          isOverlay={overlay}
          setIsOverlay={setIsOverlay}
          keyForm={key}
          setKeyForm={setKey}
          handleOpenForm={handleOpenForm}
        />
      )}
    </div>
  );
};

export default AccountMobileIndex;
