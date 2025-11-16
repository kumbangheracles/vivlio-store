import {
  Space,
  Form,
  Input,
  message,
  Upload,
  Image,
  UploadFile,
  Modal,
} from "antd";
import Cropper from "react-easy-crop";
import AppButton from "../../components/AppButton";
import HeaderPage from "../../components/HeaderPage";
import DefaultImage from "../../assets/images/profile-default.jpg";
import { useNavigate, useParams } from "react-router-dom";
import HeaderSection from "../../components/HeaderSection";
import AppInput from "../../components/AppInput";
import { useCallback, useEffect, useState } from "react";
import myAxios from "../../helper/myAxios";
import { isEmpty } from "../../helper/validation";
import { ErrorHandler } from "../../helper/handleError";
import { initialUser, UserImage, UserProperties } from "../../types/user.type";
import AppSelect from "../../components/AppSelect";
import { RoleProperties } from "../../types/role.type";
import { PlusOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import { RcFile, UploadChangeParam } from "antd/es/upload";
import { UploadFileStatus } from "antd/es/upload/interface";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import getCroppedImg from "../../helper/getCroppedImage";
const UserEdit = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProperties>(initialUser);
  const [dataRoles, setDataRoles] = useState<RoleProperties[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [form] = Form.useForm();
  const { id } = useParams();
  const auth = useAuthUser<UserProperties>();

  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const fetchRoles = async () => {
    try {
      const res = await myAxios.get("/roles");
      console.log("Fetched categories:", res.data.results);

      let data = res.data.results;

      if (auth?.role === "admin") {
        data = data.filter(
          (cat: RoleProperties) => cat.name.toLowerCase() === "customer"
        );
      }

      const options = data.map((cat: RoleProperties) => ({
        label: cat.name,
        value: cat.id,
      }));

      setDataRoles(options);
    } catch (error) {
      ErrorHandler(error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleSubmit = async (
    data: UserProperties,
    status: UserProperties["isActive"]
  ) => {
    form.validateFields();

    if (
      isEmpty(data.fullName) ||
      isEmpty(data.username) ||
      isEmpty(data.password) ||
      isEmpty(data.email) ||
      isEmpty(data.roleId)
    ) {
      message.error("All field is required!.");
      return;
    }
    // if (isEmpty(data.username)) {
    //   message.error("Username is required");
    //   return;
    // }
    // if (isEmpty(data.email)) {
    //   message.error("Email is required");
    //   return;
    // }
    try {
      setIsLoading(true);
      const payload = {
        fullName: data.fullName,
        username: data.username,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        isActive: status,
        roleId: data.roleId,
        profileImage: JSON.stringify(data.profileImage),
      };

      if (!id) {
        await myAxios.post("/users", payload);
        message.success("User created successfully");
      } else {
        await myAxios.patch(`/users/${id}`, payload);
        message.success("User updated successfully");
      }

      navigate(-1);
    } catch (error) {
      // ErrorHandler(error);
      console.log("error created user: ", error);
      if (!id) {
        message.error("Failed created user");
      } else {
        message.error("Failed updated user");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDataUser = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const res = await myAxios.get(`/users/${id}`);
      console.log("Data user: ", res.data);
      const data = res.data.result;
      setUser(data);
      // form.setFieldsValue(res.data.result);
      form.setFieldsValue({
        ...data,
        users: Array.isArray(data.users)
          ? data.users.map((item: UserProperties) => item.id)
          : [],
      });
      const profileImage = res.data.result.profileImage;
      const imagePrev: UploadFile<any>[] = [
        {
          uid: "1",
          name: "image.jpg",
          status: "done" as UploadFileStatus,
          url: "https://example.com/image.jpg",
          response: {
            secure_url: "https://example.com/image.jpg",
            public_id: "some-id",
          },
        },
      ];

      // setDataGenre(res.data.result.genres);
      setFileList(imagePrev);
      setPreviewImage(profileImage.imageUrl);
    } catch (error) {
      // ErrorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);
  const handleCropSave = async () => {
    try {
      const croppedImage = await getCroppedImg(
        selectedImage,
        croppedAreaPixels
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
        }
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
      setUser((prev) => ({ ...prev, profileImage: mappedImage }));
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
      setUser((prev) => ({
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
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 10,
        gap: 10,
      }}
      type="button"
    >
      <PlusOutlined />
      <div>Upload</div>
    </button>
  );

  useEffect(() => {
    fetchDataUser();
  }, [id]);
  return (
    <>
      <HeaderPage
        icon="back"
        title="Create New User"
        breadcrumb="Home / User / Add"
        rightAction={
          <>
            <Space>
              <AppButton
                label="Cancel"
                onClick={() => navigate(-1)}
                loading={isLoading}
              />

              <AppButton
                customColor="normal"
                label="Save as inactive"
                onClick={() => {
                  if (user.username === "herkalsuperadmin") {
                    return message.info("this user cannot be inactivated");
                  }
                  handleSubmit(user, false);
                }}
                loading={isLoading}
              />
              <AppButton
                customColor="primary"
                label="Save"
                onClick={() => handleSubmit(user, true)}
                loading={isLoading}
              />
            </Space>
          </>
        }
      />

      <HeaderSection
        sectionTitle="User Form"
        sectionSubTitle="this section is for creating new genre"
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="profileImage" label="Profile Image">
            <>
              <div
                style={{
                  width: "300px",
                  height: "300px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "5px solid gray",
                }}
              >
                <Image
                  style={{
                    cursor: "pointer",
                    width: "100%",
                    height: "100%",
                    // transform: "scale(1.2)",
                  }}
                  src={previewImage || DefaultImage}
                />
              </div>
              <Upload
                listType="picture-card"
                fileList={fileList}
                showUploadList={false}
                onChange={handleUpload}
                maxCount={1}
                beforeUpload={beforeUpload}
                style={{ cursor: "pointer", width: 100, height: 30 }}
              >
                {uploadButton}
              </Upload>
            </>
          </Form.Item>
          <Form.Item
            name={"fullName"}
            label="Full Name"
            rules={[{ required: true, message: "Full Name are required" }]}
          >
            <AppInput
              required
              placeholder="Input user's full name"
              onChange={(e) =>
                setUser({
                  ...user,
                  fullName: e.target.value,
                })
              }
            />
          </Form.Item>
          <Form.Item
            name={"username"}
            label="Username"
            rules={[{ required: true, message: "Username are required" }]}
          >
            <AppInput
              required
              placeholder="Input username"
              onChange={(e) =>
                setUser({
                  ...user,
                  username: e.target.value,
                })
              }
            />
          </Form.Item>
          <Form.Item
            name={"email"}
            label="Email"
            rules={[
              { required: true, message: "Email is required " },
              { type: "email", message: "invalid format" },
            ]}
          >
            <AppInput
              required
              placeholder="Input email"
              onChange={(e) =>
                setUser({
                  ...user,
                  email: e.target.value,
                })
              }
            />
          </Form.Item>
          <Form.Item
            name={"roleId"}
            label="Role"
            rules={[{ required: true, message: "Role are required" }]}
          >
            <AppSelect
              options={dataRoles}
              placeholder="Input Role"
              onChange={(e) =>
                setUser({
                  ...user,
                  roleId: e,
                })
              }
            />
          </Form.Item>
          <Form.Item
            name={"password"}
            label="Password"
            rules={[
              { required: true, message: "Password is required" },
              { min: 6, message: "6 character are needed" },
              {
                pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/,
                message: "Password must include alphabet and numeric",
              },
            ]}
          >
            <Input.Password
              type="password"
              required
              placeholder="Input Password"
              onChange={(e) =>
                setUser({
                  ...user,
                  password: e.target.value,
                })
              }
            />
          </Form.Item>
        </Form>
      </HeaderSection>

      <Modal
        open={cropModalOpen}
        onCancel={() => setCropModalOpen(false)}
        onOk={handleCropSave}
        okText="Save"
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
    </>
  );
};

export default UserEdit;
