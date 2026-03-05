"use client";
import GlobalLoading from "@/components/GlobalLoading";
import NotFoundPage from "@/components/NotFoundPage";
import useDeviceType from "@/hooks/useDeviceType";
import { useMounted } from "@/hooks/useMounted";
import { initialUser, UserImage, UserProperties } from "@/types/user.type";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DefaultImage from "../../../assets/images/profile-default.jpg";
import { Divider, Empty, message, Modal, UploadFile } from "antd";
import { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import OverlayModal from "./OverlayModal";
import { CategoryProps } from "@/types/category.types";
import getCroppedImg from "@/helpers/getCroppedImage";
import Upload, { UploadChangeParam, RcFile } from "antd/es/upload";
import AppButton, { MyButton } from "@/components/AppButton";
import Cropper from "react-easy-crop";
import myAxios from "@/libs/myAxios";
interface PropTypes {
  dataUser: UserProperties;
  dataCategory: CategoryProps[];
}
export type FormKey = "fullName" | "password" | "preference" | "username";
const AccountMobileIndex = ({ dataUser, dataCategory }: PropTypes) => {
  const router = useRouter();

  const isMobile = useDeviceType();
  const [overlay, setIsOverlay] = useState<boolean>(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDataUser, setIsDataUser] = useState<UserProperties>(initialUser);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [key, setKey] = useState<FormKey | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
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
  //   console.log("Data user: ", dataUser);
  // }, []);

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);
  const handleCropSave = async () => {
    // return;

    try {
      setLoading(true);
      const croppedImage = await getCroppedImg(
        selectedImage,
        croppedAreaPixels,
      );
      setCropModalOpen(false);

      // Upload hasil cropping ke Cloudinary
      const formData = new FormData();
      formData.append("file", croppedImage);
      formData.append("upload_preset", "vivlio-store");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/don5olb8f/image/upload",
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();

      const mappedImage = [
        {
          userId: uuidv4(),
          imageUrl: data.secure_url,
          public_id: data.public_id,
        },
      ];

      setPreviewImage(data.secure_url);
      setIsDataUser((prev) => ({ ...prev, profileImage: mappedImage }));
      setFileList([
        {
          uid: uuidv4(),
          name: "profile.jpg",
          status: "done",
          url: data.secure_url,
          response: data,
        },
      ]);
    } catch (e) {
      console.error(e);
      message.error("Failed to crop image");
    } finally {
      setLoading(false);
    }
  };
  const handleUpload = async (info: UploadChangeParam<UploadFile>) => {
    const latestFileList = info.fileList.slice(-1);
    setFileList(latestFileList);

    const mappedImages: UserImage[] = latestFileList
      .filter((file) => file.status === "done" && !!file.response?.secure_url)
      .map((file) => ({
        userId: uuidv4() as string,
        imageUrl: file.response.secure_url as string,
        public_id: file.response.public_id as string,
      }));
    const latestFile = latestFileList[0]?.originFileObj;
    if (latestFile) {
      const imageUrl = await getBase64(latestFile as RcFile);
      setPreviewImage(imageUrl);
      setCropModalOpen(true);
      setSelectedImage(imageUrl);
      setIsDataUser((prev) => ({
        ...prev,
        profileImage: mappedImages,
      }));
    }
  };

  const getBase64 = (file: File | Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const beforeUpload = (file: RcFile): boolean => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";

    if (!isJpgOrPng) {
      message.error("Invalid image format");
      setTimeout(() => {
        setCropModalOpen(false);
        setSelectedImage("");
      }, 200);
      return false;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image size maximum 2MB");
      setTimeout(() => {
        setCropModalOpen(false);
        setSelectedImage("");
      }, 200);
      return false;
    }

    return true;
  };

  const handleSubmit = async (data: UserProperties) => {
    try {
      setLoading(true);

      let payload: Record<string, any> = {
        profileImage:
          JSON.stringify(data.profileImage) ??
          JSON.stringify(dataUser?.profileImage),
      };

      console.log("Payload", payload);

      const res = await myAxios.patch(`/users/${dataUser?.id}`, payload);
      if (res) {
        message.success("Success update data");
      }

      setPreviewImage("");
      router.refresh();
    } catch (error) {
      if (!dataUser?.id) {
        message.error("Failed submit data");
        console.log("Failed submit data: ", error);
      } else {
        message.error("Failed update data");
        console.log("Failed update data: ", error);
      }
    } finally {
      setLoading(false);
      router.refresh();
    }
  };

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
            src={
              previewImage || dataUser?.profileImage?.imageUrl || DefaultImage
            }
            alt={`img-${dataUser?.username}`}
            width={500}
            height={500}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="mt-[14px] flex items-center justify-center">
          {previewImage ? (
            <div className="flex items-center gap-1">
              <AppButton
                loading={loading}
                label="Cancel"
                customColor="danger"
                onClick={() => setPreviewImage("")}
                style={{ fontSize: 12 }}
              />

              <Upload
                fileList={fileList}
                showUploadList={false}
                onChange={handleUpload}
                maxCount={1}
                beforeUpload={beforeUpload}
              >
                <MyButton loading={loading} style={{ fontSize: 12 }}>
                  Change Profile Photo
                </MyButton>
              </Upload>

              <AppButton
                label="Submit"
                style={{ fontSize: 12 }}
                loading={loading}
                onClick={() => handleSubmit(isDataUser as UserProperties)}
              />
            </div>
          ) : (
            <Upload
              fileList={fileList}
              showUploadList={false}
              onChange={handleUpload}
              maxCount={1}
              beforeUpload={beforeUpload}
            >
              <AppButton label="Change Profile Photo" loading={loading} />
            </Upload>
          )}
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

      <Modal
        open={cropModalOpen}
        onCancel={() => {
          (setCropModalOpen(false), setPreviewImage(""));
        }}
        onOk={handleCropSave}
        okText="Save"
        loading={loading}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 400,
          }}
        >
          <Cropper
            image={selectedImage}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
      </Modal>
    </div>
  );
};

export default AccountMobileIndex;
