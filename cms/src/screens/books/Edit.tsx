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
  anyFieldsValid,
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
import FormEditor from "../../components/FormEditor";
import { GenreProperties, GenreStatusType } from "../../types/genre.type";
import { useDebounce } from "../../hooks/useDebounce";
import { useDebouncedFilter } from "../../hooks/useDebounceFiltered";
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
  const [dataGenre, setDataGenre] = useState<GenreProperties[]>([]);
  const [search, setSearch] = useState("");

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
  const fetchGenre = async () => {
    try {
      const res = await myAxios.get("/genres");
      console.log("Fetched genres:", res.data.results);
      const activeGenres = res.data.results.filter(
        (cat: GenreProperties) => cat.status === GenreStatusType.PUBLISH
      );

      const options = activeGenres.map((cat: GenreProperties) => ({
        label: cat.genre_title,
        value: cat.genreId!,
      }));
      setDataGenre(options);
    } catch (error) {
      ErrorHandler(error);
    }
  };

  useEffect(() => {
    fetchCategory();
    fetchGenre();
  }, []);
  const handleSubmit = async (data: BookProps, status: BookProps["status"]) => {
    form.validateFields();
    const parsed = Number(data.price);
    if (
      isEmpty(data.title) ||
      isEmpty(data.description) ||
      isEmpty(data.author)
      // isEmpty(data.book_type)
      // isEmptyArray(data.genre) ||
    ) {
      message.error("All fields are required");
      return;
    }
    // if (anyFieldsValid(data)) {
    //   message.error("All fields are required");
    //   // return;
    // }
    if (isEmpty(data.title)) {
      message.error("Title is required");
      return;
    }

    if (!Array.isArray(data.images) || data.images.length === 0) {
      message.error("At least one book image is required");
      return;
    }

    if (isEmpty(data.description)) {
      message.error("Description is required");
      return;
    }

    if (isEmpty(data.author)) {
      message.error("Author is required");
      return;
    }

    if (isEmpty(data.book_type)) {
      message.error("Book type is required");
      return;
    }

    if (isEmptyArray(data.genres)) {
      message.error("At least one genre is required");
      return;
    }

    if (isValidNumber(data.price)) {
      message.error("Price is required");
      return;
    }

    if (!isValidNumber(parsed)) {
      message.error("Invalid price");
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        images: JSON.stringify(data.images),
        title: data.title,
        author: data.author,
        price: data.price as unknown as number,
        description: data.description,
        genres: data.genres,

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
      console.log("error submit: ", error);

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
      const data = res.data.result;
      setDataBook(data);
      form.setFieldsValue({
        ...data,
        genres: Array.isArray(data.genres)
          ? data.genres.map((item: GenreProperties) => item.genreId)
          : [],
      });
      const imagePrev = res.data.result.images.map(
        (item: any, index: number) => ({
          uid: String(item.id || index),
          name: `image-${index + 1}.jpg`,
          status: "done",
          url: item.imageUrl,
          response: {
            secure_url: item.imageUrl,
            public_id: item.public_id,
          },
        })
      );
      // setDataGenre(res.data.result.genres);
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
        public_id: file.response.public_id,
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
      <div style={{ paddingBottom: "1rem" }}>
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
                    afterOpenChange: (visible) =>
                      !visible && setPreviewImage(""),
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
                filterOption={(input, option) =>
                  (option?.label as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                showSearch
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
                showSearch
                options={dataCategory}
                placeholder={"Choose Category"}
                filterOption={(input, option) =>
                  (option?.label as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                onChange={(e) => {
                  setDataBook({
                    ...dataBook,
                    categoryId: e,
                  });
                }}
              />
            </Form.Item>
            <Form.Item
              name={"genres"}
              label="Genre"
              rules={[{ required: true, message: "Genre are required" }]}
            >
              <AppSelect
                showSearch
                allowClear
                mode="multiple"
                filterOption={(input, option) =>
                  (option?.label as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={dataGenre}
                placeholder={"Input Genre"}
                onChange={(e) => {
                  setDataBook({
                    ...dataBook,
                    genres: e,
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
              <FormEditor
                height={400}
                value={dataBook.description as string}
                onChange={(e) =>
                  setDataBook((prev) => ({
                    ...prev,
                    description: e,
                  }))
                }
              />
            </Form.Item>
          </Form>
        </HeaderSection>
      </div>
    </>
  );
};

export default BookEdit;
