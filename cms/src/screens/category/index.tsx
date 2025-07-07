import { Button, Col, Row, Space, Table } from "antd";
import HeaderPage from "../../components/HeaderPage";
import AppLayout from "../../components/Layouts";
import AppButton from "../../components/AppButton";
import AppInput from "../../components/AppInput";
import { SearchOutlined } from "@ant-design/icons";
import { CategoryProps } from "../../types/category.type";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import AppTable from "../../components/AppTable";

const Category = () => {
  const categoryColumns: ColumnsType<CategoryProps> = [
    {
      title: "Category ID",
      dataIndex: "categoryId",
      key: "categoryId",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => text || "-",
    },
    {
      title: "Popular",
      dataIndex: "isPopular",
      key: "isPopular",
      render: (value: boolean) => (value ? "Yes" : "No"),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: string) => dayjs(value).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (value: string) => dayjs(value).format("YYYY-MM-DD HH:mm"),
    },
  ];
  return (
    <>
      <AppLayout>
        <HeaderPage
          title="Category"
          breadcrumb="Home / Category"
          rightAction={
            <>
              <Space>
                <AppButton color="primary" label="Create New Category" />
              </Space>
            </>
          }
        />

        <Row>
          <Col>
            <AppInput
              icon={<SearchOutlined />}
              placeholder="Search by category name"
            />
          </Col>
        </Row>

        <AppTable style={{ marginTop: 20 }} columns={categoryColumns} />
      </AppLayout>
    </>
  );
};

export default Category;
