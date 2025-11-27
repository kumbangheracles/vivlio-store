import {
  Space,
  message,
  Form,
  Upload,
  Input,
  Modal,
  Image,
  UploadFile,
} from "antd";
import AppButton from "../../components/AppButton";
import AppInput from "../../components/AppInput";
import HeaderPage from "../../components/HeaderPage";
import HeaderSection from "../../components/HeaderSection";
import { useEffect, useState } from "react";
import DefaultImage from "../../assets/images/default-img.png";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
  ArticleImage,
  ArticleProperties,
  initialArticleValue,
} from "../../types/article.type";
import { isEmpty } from "../../helper/validation";
import { PlusOutlined } from "@ant-design/icons";
import { RcFile, UploadChangeParam } from "antd/es/upload";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { AuthProps } from "../../types/auth.type";
import myAxios from "../../helper/myAxios";
import { UploadFileStatus } from "antd/es/upload/interface";

const ArticleEdit = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [article, setArticle] =
    useState<ArticleProperties>(initialArticleValue);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string>("");
  const auth = useAuthUser<AuthProps>();

  const handleSubmit = async (
    data: ArticleProperties,
    status: ArticleProperties["status"]
  ) => {
    form.validateFields();

    if (
      isEmpty(data.title) ||
      isEmpty(data.description) ||
      isEmpty(previewImage)
    ) {
      message.error("All fields is required!.");
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        title: data.title,
        status: status,
        description: data.description,
        createdByAdminId: auth?.id,
        articleImages: JSON.stringify(data.articleImages),
      };

      if (!id) {
        await myAxios.post("/articles", payload);
        message.success("Success create article.");
        navigate("/article");
      } else {
        await myAxios.patch(`/articles/${id}`, payload);
        message.success("Success update article.");
        navigate("/article");
      }
    } catch (error) {
      message.error("Failed create article.");
      console.log("Error post article: ", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleUpload = async (info: UploadChangeParam<UploadFile>) => {
    const latestFileList = info.fileList.slice(-1);
    setFileList(latestFileList);

    const mappedImages: ArticleImage[] = latestFileList
      .filter((file) => file.status === "done" && !!file.response?.secure_url)
      .map((file) => ({
        articleId: uuidv4() as string,
        imageUrl: file.response.secure_url as string,
        public_id: file.response.public_id as string,
      }));
    const latestFile = latestFileList[0]?.originFileObj;
    if (latestFile) {
      const imageUrl = await getBase64(latestFile as RcFile);
      setPreviewImage(imageUrl);
      // setCropModalOpen(true);
      setSelectedImage(imageUrl);
      setArticle((prev) => ({
        ...prev,
        articleImages: mappedImages,
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
        articleId: uuidv4(),
        imageUrl: data.secure_url,
        public_id: data.public_id,
      },
    ];

    setPreviewImage(data.secure_url);
    setArticle((prev) => ({ ...prev, articleImages: mappedImage }));
    setFileList([
      {
        uid: uuidv4(),
        name: "article-img.jpg",
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

  const fetchDataArticle = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const res = await myAxios.get(`/articles/${id}`);
      console.log("Data article: ", res.data);
      const data = res.data.result;
      setArticle(data);
      // form.setFieldsValue(res.data.result);
      form.setFieldsValue({
        ...data,
        users: Array.isArray(data.users)
          ? data.users.map((item: ArticleProperties) => item.id)
          : [],
      });
      const articleImages = res.data.result.articleImages;
      const imagePrev: UploadFile<any>[] = [
        {
          uid: "1",
          name: "article-img.jpg",
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
      setPreviewImage(articleImages.imageUrl);
    } catch (error) {
      // ErrorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDataArticle();
  }, [id]);
  return (
    <div>
      <HeaderPage
        icon="back"
        title="Create New Article"
        breadcrumb="Home / Article / Add"
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
                label="Save as Unpublished"
                onClick={() => {
                  handleSubmit(article, "UNPUBLISHED");
                }}
                loading={isLoading}
              />
              <AppButton
                customColor="primary"
                label="Save"
                onClick={() => handleSubmit(article, "PUBLISHED")}
                loading={isLoading}
              />
            </Space>
          </>
        }
      />

      <HeaderSection
        sectionTitle="Article Form"
        sectionSubTitle="this section is for creating new article"
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="articlesImage" label="Article Image" required>
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
                  loading={"eager"}
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
            name={"title"}
            label="Title"
            rules={[{ required: true, message: "Title are required" }]}
          >
            <AppInput
              required
              placeholder="Input title"
              onChange={(e) =>
                setArticle({
                  ...article,
                  title: e.target.value,
                })
              }
            />
          </Form.Item>
          <Form.Item
            name={"description"}
            label="Description"
            rules={[{ required: true, message: "Description is required" }]}
          >
            <Input.TextArea
              required
              placeholder="Input email"
              style={{ minHeight: 200, padding: "1rem" }}
              onChange={(e) =>
                setArticle({
                  ...article,
                  description: e.target.value,
                })
              }
            />
          </Form.Item>
        </Form>
      </HeaderSection>
    </div>
  );
};

export default ArticleEdit;
