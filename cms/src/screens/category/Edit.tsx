import { Space, Form, Input, Radio, message, Upload, Image } from "antd";
import AppButton from "../../components/AppButton";
import HeaderPage from "../../components/HeaderPage";
import {
  CategoryImage,
  CategoryProps,
  initialCategoryValue,
} from "../../types/category.types";
import DefaultImg from "../../assets/images/default-img.png";
import { useNavigate, useParams } from "react-router-dom";
import HeaderSection from "../../components/HeaderSection";
import AppInput from "../../components/AppInput";
import { useEffect, useState } from "react";
import myAxios from "../../helper/myAxios";
import { isEmpty, isBooleanUndefined } from "../../helper/validation";
import { ErrorHandler } from "../../helper/handleError";
import { PlusOutlined } from "@ant-design/icons";
import { RcFile, UploadChangeParam, UploadFile } from "antd/es/upload";
import { v4 as uuidv4 } from "uuid";
import { UploadFileStatus } from "antd/es/upload/interface";
const CategoryEdit = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState<CategoryProps>(initialCategoryValue);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [image, setImage] = useState<CategoryImage | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string>("");
  const { id } = useParams();
  const handleSubmit = async (data: CategoryProps) => {
    form.validateFields();
    if (
      isEmpty(data.name) ||
      isEmpty(data.description) ||
      isBooleanUndefined(data.status)
    ) {
      message.error("All fields are required");
      return;
    }
    if (isEmpty(data.name)) {
      message.error("Name is required");
      return;
    }
    if (isBooleanUndefined(data.status)) {
      message.error("Status is required");
      return;
    }
    if (isEmpty(data.description)) {
      message.error("description is required");
      return;
    }
    try {
      setIsLoading(true);
      const payload = {
        name: data.name,
        status: data.status,
        description: data.description,
        categoryImage: JSON.stringify(data.categoryImage),
      };

      console.log("Payload: ", payload);

      if (!id) {
        await myAxios.post("/book-category", payload);
        message.success("Category created successfully");
      } else {
        await myAxios.patch(`/book-category/${id}`, payload);
        message.success("Category updated successfully");
      }

      navigate(-1);
    } catch (error) {
      console.log("error submit category: ", error);

      if (!id) {
        message.error("Failed created category");
      } else {
        message.error("Failed updated category");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDataCategory = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const res = await myAxios.get(`book-category/${id}`);
      console.log("Data category: ", res.data);
      setCategory(res.data);
      const data = res.data;
      // form.setFieldsValue(res.data);
      form.setFieldsValue({
        ...data,
        category: Array.isArray(data.users)
          ? data.users.map((item: CategoryProps) => item.categoryId)
          : [],
      });
      console.log("data cat: ", data);
      const categortImage = res.data.categoryImage;
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
      setFileList(imagePrev || []);
      setPreviewImage(categortImage.imageUrl || null);
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleUpload = async (info: UploadChangeParam<UploadFile>) => {
    const latestFileList = info.fileList.slice(-1);
    setFileList(latestFileList);

    const mappedImages: CategoryImage[] = latestFileList
      .filter((file) => file.status === "done" && !!file.response?.secure_url)
      .map((file) => ({
        categoryId: uuidv4() as string,
        imageUrl: file.response.secure_url as string,
        public_id: file.response.public_id as string,
      }));
    const latestFile = latestFileList[0]?.originFileObj;
    if (latestFile) {
      const imageUrl = await getBase64(latestFile as RcFile);
      setPreviewImage(imageUrl);
      // setCropModalOpen(true);
      setSelectedImage(imageUrl);
      setCategory((prev) => ({
        ...prev,
        categoryImage: mappedImages,
      }));
    }

    const formData = new FormData();
    formData.append("file", selectedImage);
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
        categoryId: uuidv4(),
        imageUrl: data.secure_url,
        public_id: data.public_id,
      },
    ];

    setPreviewImage(data.secure_url);
    setCategory((prev) => ({ ...prev, categoryImage: mappedImage }));
    setFileList([
      {
        uid: uuidv4(),
        name: "category-icon.jpg",
        status: "done",
        url: data.secure_url,
        response: data,
      },
    ]);
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
    fetchDataCategory();
  }, [id]);
  return (
    <>
      <HeaderPage
        icon="back"
        title="Create New Category"
        breadcrumb="Home / Category / Add"
        rightAction={
          <>
            <Space>
              <AppButton label="Cancel" onClick={() => navigate(-1)} />
              <AppButton
                customColor="primary"
                label="Save"
                onClick={() => handleSubmit(category)}
              />
            </Space>
          </>
        }
      />

      <HeaderSection
        sectionTitle="Category Form"
        sectionSubTitle="this section is for creating new category"
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="categoryImage" label="Category Image">
            <>
              <div
                style={{
                  width: "300px",
                  height: "300px",

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
                  src={previewImage || DefaultImg}
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
            name={"name"}
            label="Name"
            rules={[{ required: true, message: "Name are required" }]}
          >
            <AppInput
              required
              placeholder="Input category name"
              onChange={(e) =>
                setCategory({
                  ...category,
                  name: e.target.value,
                })
              }
            />
          </Form.Item>
          <Form.Item
            name={"status"}
            label="Status"
            rules={[{ required: true, message: "Status are required" }]}
          >
            <Radio.Group
              // value={value}

              style={{
                display: "flex",
                justifyContent: "start",
                gap: "40px",
              }}
              options={[
                { value: true, label: "Active" },
                { value: false, label: "Inactive" },
              ]}
              onChange={(e) =>
                setCategory({
                  ...category,
                  status: e.target.value,
                })
              }
            />
          </Form.Item>
          <Form.Item
            name={"description"}
            label="Description"
            rules={[{ required: true, message: "Description are required" }]}
          >
            <Input.TextArea
              required
              placeholder="Description about this category"
              style={{ padding: 16, minHeight: 200 }}
              onChange={(e) =>
                setCategory({
                  ...category,
                  description: e.target.value,
                })
              }
            />
          </Form.Item>
        </Form>
      </HeaderSection>
    </>
  );
};

export default CategoryEdit;
