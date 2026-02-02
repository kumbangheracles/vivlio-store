"use client";
import { Card, Form, message, Modal, Upload } from "antd";
import Cropper from "react-easy-crop";
import Image from "next/image";
import styled from "styled-components";
import DefaultImage from "../../assets/images/profile-default.jpg";
import AppButton, { MyButton } from "../AppButton";
import DetailItem from "../DetailItem";
import { useCallback, useEffect, useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import { initialUser, UserImage, UserProperties } from "@/types/user.type";
import myAxios from "@/libs/myAxios";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import getCroppedImg from "@/helpers/getCroppedImage";
import { v4 as uuidv4 } from "uuid";
import { RcFile, UploadChangeParam, UploadFile } from "antd/es/upload";
import AccountForm from "./AccountForm";
type FieldKey = "fullName" | "username" | "email" | "password" | "";

interface PropsType {
  dataUser?: UserProperties;
}

const Account = ({ dataUser }: PropsType) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState<FieldKey>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isDataUser, setIsDataUser] = useState<UserProperties>(initialUser);
  const [form] = Form.useForm();
  const router = useRouter();
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [selectedImage, setSelectedImage] = useState<string>("");

  const handleModalOpen = (key: FieldKey) => {
    setModalOpen(true);
    setActiveKey(key);
    console.log("Key: ", key);
  };

  const handleSubmit = async (data: UserProperties) => {
    // const [form] = Form.useForm();
    try {
      await form.validateFields();
    } catch (error) {
      message.error("Validation failed");
      return;
    }

    // if (!beforeUpload(data?.profileImage as RcFile)) {
    //   message.error(
    //     "Image size & format are not valid please change the image.",
    //   );
    //   return;
    // }
    // Password specific validations
    if (activeKey === "password") {
      if (!data?.oldPassword) {
        message.error("Old password is required");
        return;
      }

      if (!data?.password) {
        message.error("New password is required");
        return;
      }

      if (!data?.confirmPassword) {
        message.error("Confirm password is required");
        return;
      }

      if (data?.confirmPassword !== data?.password) {
        message.error("Password did not match");
        return;
      }

      // Validasi old password harus dilakukan di backend
      // Karena password di dataUser sudah ter-hash
    }

    // Other field validations
    if (activeKey === "fullName" && !data?.fullName && !dataUser?.fullName) {
      message.error("Full name is required");
      return;
    }

    if (activeKey === "email" && !data?.email && !dataUser?.email) {
      message.error("Email is required");
      return;
    }

    if (activeKey === "username" && !data?.username && !dataUser?.username) {
      message.error("Username is required");
      return;
    }

    try {
      setLoading(true);

      // const payload = {
      //   fullName: data.fullName || dataUser?.fullName,
      //   username: data.username || dataUser?.username,
      //   password: data.password || dataUser?.password,
      //   email: data.email || dataUser?.email,
      //   isActive: true || dataUser?.isActive,
      //   profileImage:
      //     JSON.stringify(data.profileImage) ||
      //     JSON.stringify(dataUser?.profileImage),
      // };
      let payload: Record<string, any> = {
        profileImage:
          JSON.stringify(data.profileImage) ??
          JSON.stringify(dataUser?.profileImage),
      };

      if (activeKey === "fullName") {
        payload = {
          ...payload,
          fullName: data.fullName,
        };
      } else if (activeKey === "username") {
        payload = {
          ...payload,
          username: data.username,
        };
      } else if (activeKey === "email") {
        payload = {
          ...payload,
          email: data.email,
        };
      } else if (activeKey === "password") {
        payload = {
          ...payload,
          password: data.password,
        };
      }

      console.log("Payload", payload);

      // if (!dataUser?.id) {
      //   await myAxios.post("/users", payload);
      //   message.success("Success submit data");
      // } else {
      const res = await myAxios.patch(`/users/${dataUser?.id}`, payload);
      if (res) {
        message.success("Success update data");
      }
      //   if (res) {
      //     message.success("Success update data");

      //     PostUser(payload?.username as string, payload?.password as string);
      //   }
      // }

      if (payload.password || payload.username) {
        await signOut({ redirect: false });

        await signIn("credentials", {
          redirect: false,
          identifier: payload.username ?? dataUser?.username,
          password: payload.password,
        });
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
      setModalOpen(false);
    }
  };

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
      return false;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image size maximum 2MB");
      return false;
    }

    return true;
  };
  // useEffect(() => {
  //   if (activeKey) {
  //     const [form] = Form.useForm();
  //     form.setFieldsValue(dataUser);
  //   }
  // }, [activeKey]);
  return (
    <Card className="shadow-md">
      <TitleTab>Account Setting</TitleTab>
      <CardStyled>
        <PictureSide>
          <ImageWrapper>
            <Image
              src={
                previewImage || dataUser?.profileImage?.imageUrl || DefaultImage
              }
              width={100}
              height={100}
              alt="image-account"
            />
          </ImageWrapper>

          <div className="flex items-center gap-2.5 transition-all duration-300 ease-in-out">
            {previewImage ? (
              <>
                <AppButton
                  loading={loading}
                  label="Cancel"
                  customColor="danger"
                  onClick={() => setPreviewImage("")}
                />

                <Upload
                  fileList={fileList}
                  showUploadList={false}
                  onChange={handleUpload}
                  maxCount={1}
                  beforeUpload={beforeUpload}
                >
                  <MyButton loading={loading}>Change Profile Photo</MyButton>
                </Upload>

                <AppButton
                  label="Submit"
                  onClick={() => handleSubmit(isDataUser as UserProperties)}
                />
              </>
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
        </PictureSide>

        <DataSide>
          {/* <h1 className="setting-title">Account Settings</h1> */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center w-full justify-between">
              <DetailItem label="Full Name" value={dataUser?.fullName} />
              <EditOutlined onClick={() => handleModalOpen("fullName")} />
            </div>
            <div className="flex items-center w-full justify-between">
              <DetailItem label="Username" value={dataUser?.username} />
              <EditOutlined onClick={() => handleModalOpen("username")} />
            </div>
            <div className="flex items-center w-full justify-between">
              <DetailItem label="Email" value={dataUser?.email} />
              <EditOutlined onClick={() => handleModalOpen("email")} />
            </div>
            <div className="flex items-center w-full justify-between">
              <DetailItem label="Password" value="**********" />
              <EditOutlined onClick={() => handleModalOpen("password")} />
            </div>
          </div>
        </DataSide>
      </CardStyled>

      <Modal
        key={activeKey}
        onCancel={() => setModalOpen(false)}
        open={modalOpen}
        footer={
          <div className="w-full">
            <AppButton
              className="w-full"
              style={{ height: 40 }}
              label="Save"
              customColor="primary"
              onClick={() => handleSubmit(isDataUser as UserProperties)}
              loading={loading}
            />
          </div>
        }
      >
        {activeKey && (
          <AccountForm
            activeKey={activeKey}
            loading={loading}
            onSubmit={handleSubmit}
            dataUser={dataUser}
          />
        )}
      </Modal>

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
    </Card>
  );
};

export default Account;

const PictureSide = styled.div`
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 16px;
  width: 50%;
`;

const CardStyled = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  /* border: 1px solid black; */
`;

const TitleTab = styled.h1`
  font-weight: 500;
  font-size: 20px;
`;

const ImageWrapper = styled.div`
  border-radius: 50%;
  width: 130px;
  height: 130px;
  overflow: hidden;
  display: flex;

  align-items: center;
  justify-content: center;
  border: 1px solid black;

  img {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    object-fit: cover;
  }
`;

const DataSide = styled.div`
  padding: 1rem;
  width: 50%;

  .setting-title {
    padding: 1rem;
    font-weight: 500;
    font-size: 19px;
  }
`;
