import { Space, Form, Input, Radio, message, Select, Image } from "antd";
import AppButton from "../../components/AppButton";
import HeaderPage from "../../components/HeaderPage";

import { useNavigate, useParams } from "react-router-dom";
import HeaderSection from "../../components/HeaderSection";
import AppInput from "../../components/AppInput";
import { useEffect, useState } from "react";
import myAxios from "../../helper/myAxios";
import {
  isEmpty,
  isBooleanUndefined,
  isEmptyArray,
  isValidBookImageArray,
  isValidNumber,
} from "../../helper/validation";
import { ErrorHandler } from "../../helper/handleError";
import {
  BookImage,
  BookProps,
  BookType,
  initialBookProps,
} from "../../types/books.type";
import AppSelect from "../../components/AppSelect";
import Upload, {
  RcFile,
  UploadChangeParam,
  UploadFile,
  UploadProps,
} from "antd/es/upload";
import defaultImg from "../../assets/images/default-img.png";
import { PlusOutlined } from "@ant-design/icons";
import { CategoryProps } from "../../types/category.types";
import { v4 as uuidv4 } from "uuid";
const BookEdit = () => {
  const navigate = useNavigate();
  const [dataBook, setDataBook] = useState<BookProps>(initialBookProps);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const { id } = useParams();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [dataCategory, setDataCategory] = useState<CategoryProps[]>([]);

  const getBase64 = (file: File | Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const fetchCategory = async () => {
    try {
      const res = await myAxios.get("/book-category");
      console.log("Fetched categories:", res.data.results);
      const activeCategories = res.data.results.filter(
        (cat: CategoryProps) => cat.status === true
      );

      const options = activeCategories.map((cat: CategoryProps) => ({
        label: cat.name,
        value: cat.categoryId!,
      }));
      setDataCategory(options);
    } catch (error) {
      ErrorHandler(error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);
  const handleSubmit = async (data: BookProps, status: BookProps["status"]) => {
    form.validateFields();
    // if (
    //   isEmpty(data.title) ||
    //   isValidBookImageArray(data.images) ||
    //   isEmpty(data.description) ||
    //   isEmpty(data.status) ||
    //   isEmpty(data.author) ||
    //   isEmpty(data.book_type)
    //   // isEmptyArray(data.genre) ||
    //   // isValidNumber(data.price)
    // ) {
    //   message.error("All fields are required");
    //   return;
    // }
    if (isEmpty(data.title)) {
      message.error("Title is required");
      return;
    }

    if (isEmpty(data.description)) {
      message.error("description is required");
      return;
    }

    // if (typeof data.price !== "number") {
    //   message.error("Price are only number");
    //   return;
    // }
    try {
      setIsLoading(true);
      const payload = {
        images: JSON.stringify(data.images),
        title: data.title,
        author: data.author,
        price: data.price,
        description: data.description,
        // genre: data.genre,

        status: status,
        book_type: data.book_type,
        categoryId: data.categoryId,
      };

      console.log("Data payload: ", payload);
      if (!id) {
        await myAxios.post("/books", payload);
        message.success("Book created successfully");
      } else {
        await myAxios.patch(`/books/${id}`, payload);
        message.success("Book updated successfully");
      }

      navigate(-1);
    } catch (error) {
      console.log("error created Book: ", error);

      if (!id) {
        ErrorHandler(error);
      } else {
        message.error("Failed updated Book");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDataBook = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const res = await myAxios.get(`books/${id}`);
      console.log("Data Book: ", res.data);
      setDataBook(res.data.result);
      form.setFieldsValue(res.data.result);
      const imagePrev = res.data.result.images.map(
        (item: any, index: number) => ({
          uid: String(item.id || index),
          name: `image-${index + 1}.jpg`,
          status: "done",
          url: item.imageUrl,
        })
      );

      setFileList(imagePrev);
      setPreviewImage(imagePrev);
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCustomUpload = async ({ file, onSuccess, onError }: any) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "vivlio-store");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/don5olb8f/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      onSuccess(data, file);
    } catch (err) {
      onError(err);
    }
  };

  useEffect(() => {
    fetchDataBook();
  }, [id]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList }) => {
    setFileList(fileList);

    const mappedImages: BookImage[] = fileList
      .filter((file) => file.status === "done" && !!file.response?.secure_url)
      .map((file) => ({
        bookId: uuidv4(),
        imageUrl: file.response.secure_url,
      }));

    setDataBook((prev) => ({
      ...prev,
      images: mappedImages,
    }));
  };

  const uploadButton = (
    <button
      style={{ border: 0, background: "none", cursor: "pointer" }}
      type="button"
    >
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  return (
    <>
      <HeaderPage
        icon="back"
        title="Create New Book"
        breadcrumb="Home / Book / Add"
        rightAction={
          <>
            <Space>
              <AppButton
                label="Cancel"
                loading={isLoading}
                onClick={() => navigate(-1)}
              />
              <AppButton
                customColor="normal"
                label="Save as unpublish"
                loading={isLoading}
                onClick={() => handleSubmit(dataBook, "UNPUBLISHED")}
              />
              <AppButton
                customColor="primary"
                label="Save"
                loading={isLoading}
                onClick={() => handleSubmit(dataBook, "PUBLISHED")}
              />
            </Space>
          </>
        }
      />

      <HeaderSection
        sectionTitle="Book Form"
        sectionSubTitle="this section is for creating new Book"
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label={"Image"}
            name="file"
            required
            // rules={[{ required: true, message: "Images are required" }]}
            valuePropName="fileList"
            getValueFromEvent={(e: UploadChangeParam<UploadFile>) =>
              e?.fileList
            }
          >
            <>
              <Upload
                customRequest={handleCustomUpload}
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                maxCount={5}
                style={{ cursor: "pointer" }}
              >
                {fileList.length >= 5 ? null : uploadButton}
              </Upload>

              <Image
                wrapperStyle={{ display: "none" }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(""),
                }}
                src={previewImage}
              />
            </>
          </Form.Item>
          <Form.Item
            name={"title"}
            label="Title"
            rules={[{ required: true, message: "Title are required" }]}
          >
            <AppInput
              required
              placeholder="Input Book Title"
              onChange={(e) =>
                setDataBook({
                  ...dataBook,
                  title: e.target.value,
                })
              }
            />
          </Form.Item>
          <Form.Item
            name={"author"}
            label="Author's Name"
            rules={[{ required: true, message: "Author are required" }]}
          >
            <AppInput
              required
              placeholder="Input Author's name"
              onChange={(e) =>
                setDataBook({
                  ...dataBook,
                  author: e.target.value,
                })
              }
            />
          </Form.Item>
          <Form.Item
            name={"book_type"}
            label="Book Type"
            rules={[{ required: true, message: "Book Type are required" }]}
          >
            <AppSelect
              options={Object.values(BookType).map((i) => ({
                value: i,
                label: i,
              }))}
              placeholder={"Choose Book Type"}
              onChange={(e) => {
                setDataBook({
                  ...dataBook,
                  book_type: e,
                });
              }}
            />
          </Form.Item>
          <Form.Item
            name={"categoryId"}
            label="Category"
            rules={[{ required: true, message: "Category are required" }]}
          >
            <AppSelect
              options={dataCategory}
              placeholder={"Choose Category"}
              onChange={(e) => {
                setDataBook({
                  ...dataBook,
                  categoryId: e,
                });
              }}
            />
          </Form.Item>
          <Form.Item
            name={"price"}
            label="Price"
            rules={[{ required: true, message: "Price are required" }]}
          >
            <AppInput
              required
              placeholder="Input Price"
              onChange={(e) =>
                setDataBook({
                  ...dataBook,
                  price: e.target.value as unknown as number,
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
              placeholder="Description about this Book"
              style={{ padding: 16, minHeight: 200, border: "1px solid gray" }}
              onChange={(e) =>
                setDataBook({
                  ...dataBook,
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

export default BookEdit;
