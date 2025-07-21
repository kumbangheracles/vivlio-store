import { Space, Form, Input, Radio, message } from "antd";
import AppButton from "../../components/AppButton";
import HeaderPage from "../../components/HeaderPage";
import {
  CategoryProps,
  initialCategoryValue,
} from "../../types/category.types";
import { useNavigate, useParams } from "react-router-dom";
import HeaderSection from "../../components/HeaderSection";
import AppInput from "../../components/AppInput";
import { useEffect, useState } from "react";
import myAxios from "../../helper/myAxios";
import { isEmpty, isBooleanUndefined } from "../../helper/validation";
import { ErrorHandler } from "../../helper/handleError";

const CategoryEdit = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState<CategoryProps>(initialCategoryValue);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
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
      const payload = {
        name: data.name,
        status: data.status,
        description: data.description,
      };

      if (!id) {
        await myAxios.post("/book-category", payload);
        message.success("Category created successfully");
      } else {
        await myAxios.post("/book-category", payload);
        message.success("Category updated successfully");
      }

      navigate(-1);
    } catch (error) {
      console.log("error created category: ", error);

      if (!id) {
        message.success("Failed created category");
      } else {
        message.success("Failed updated category");
      }
    }
  };

  const fetchDataCategory = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const res = await myAxios.get(`book-category/${id}`);
      console.log("Data category: ", res.data);
      setCategory(res.data);
      form.setFieldsValue(res.data);
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

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
