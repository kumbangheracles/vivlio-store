import { Space, Form, Input, Radio, message, Select } from "antd";
import AppButton from "../../components/AppButton";
import HeaderPage from "../../components/HeaderPage";

import { useNavigate, useParams } from "react-router-dom";
import HeaderSection from "../../components/HeaderSection";
import AppInput from "../../components/AppInput";
import { useEffect, useState } from "react";
import myAxios from "../../helper/myAxios";
import { isEmpty, isBooleanUndefined } from "../../helper/validation";
import { ErrorHandler } from "../../helper/handleError";
import {
  genreInitialValue,
  GenreProperties,
  GenreStatusType,
} from "../../types/genre.type";

const GenreEdit = () => {
  const navigate = useNavigate();
  const [genre, setGenre] = useState<GenreProperties>(genreInitialValue);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const { id } = useParams();
  const handleSubmit = async (data: GenreProperties) => {
    form.validateFields();
    if (isEmpty(data.genre_title) || isEmpty(data.description)) {
      message.error("All fields are required");
      return;
    }
    if (isEmpty(data.genre_title)) {
      message.error("Title is required");
      return;
    }
    if (isEmpty(data.status)) {
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
        genre_title: data.genre_title,
        status: data.status,
        description: data.description,
      };

      if (!id) {
        await myAxios.post("/genres", payload);
        message.success("Genre created successfully");
      } else {
        await myAxios.patch(`/genres/${id}`, payload);
        message.success("Genre updated successfully");
      }

      navigate(-1);
    } catch (error) {
      console.log("error created genre: ", error);

      if (!id) {
        message.success("Failed created genre");
      } else {
        message.success("Failed updated genre");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDataGenre = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const res = await myAxios.get(`/genres/${id}`);
      console.log("Data Genre: ", res.data);
      setGenre(res.data.result);
      form.setFieldsValue(res.data.result);
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDataGenre();
  }, [id]);
  return (
    <>
      <HeaderPage
        icon="back"
        title="Create New Genre"
        breadcrumb="Home / Genre / Add"
        rightAction={
          <>
            <Space>
              <AppButton
                label="Cancel"
                onClick={() => navigate(-1)}
                loading={isLoading}
              />

              <AppButton
                customColor="primary"
                label="Save"
                onClick={() => handleSubmit(genre)}
                loading={isLoading}
              />
            </Space>
          </>
        }
      />

      <HeaderSection
        sectionTitle="Genre Form"
        sectionSubTitle="this section is for creating new genre"
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name={"genre_title"}
            label="Title"
            rules={[{ required: true, message: "Title are required" }]}
          >
            <AppInput
              required
              placeholder="Input genre title"
              onChange={(e) =>
                setGenre({
                  ...genre,
                  genre_title: e.target.value,
                })
              }
            />
          </Form.Item>
          <Form.Item
            name={"status"}
            label="Status"
            rules={[{ required: true, message: "Status are required" }]}
          >
            <Select
              // value={value}

              style={{
                display: "flex",
                justifyContent: "start",
                gap: "40px",
              }}
              options={[
                {
                  value: GenreStatusType.PUBLISH,
                  label: GenreStatusType.PUBLISH,
                },
                {
                  value: GenreStatusType.UNPUBLISH,
                  label: GenreStatusType.UNPUBLISH,
                },
              ]}
              onChange={(e) =>
                setGenre({
                  ...genre,
                  status: e,
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
              placeholder="Description about this genre"
              style={{ padding: 16, minHeight: 200 }}
              onChange={(e) =>
                setGenre({
                  ...genre,
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

export default GenreEdit;
