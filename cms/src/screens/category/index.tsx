import {
  Col,
  Dropdown,
  Image,
  Menu,
  message,
  Modal,
  Row,
  Space,
  Switch,
} from "antd";
import HeaderPage from "../../components/HeaderPage";
import AppButton from "../../components/AppButton";
import AppInput from "../../components/AppInput";
import { MoreOutlined, SearchOutlined } from "@ant-design/icons";
import { CategoryProps } from "../../types/category.types";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import AppTable from "../../components/AppTable";
import { useNavigate } from "react-router-dom";
import myAxios from "../../helper/myAxios";
import { useEffect, useState } from "react";
import { ErrorHandler } from "../../helper/handleError";
import { useDebounce } from "../../hooks/useDebounce";
import DefaultImg from "../../assets/images/default-img.png";

const Category = () => {
  const navigate = useNavigate();
  const [dataCategory, setDataCategory] = useState<CategoryProps[]>([]);
  const [loading, setloading] = useState<boolean>(false);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [filteredData, setFilteredData] = useState<CategoryProps[]>([]);
  const [currentPage, setCurrentPage] = useState<number | null>(1);
  const fetchCategory = async (currentPage: number, limit: number) => {
    try {
      setloading(true);
      const res = await myAxios.get("/book-category", {
        params: { page: currentPage, limit },
      });
      console.log("data category: ", res.data);
      setDataCategory(res.data.results);
      setTotalItems(res.data.total);
      setCurrentPage(res.data.currentPage);
    } catch (error) {
      console.log("error fetch category: ", error);
    } finally {
      setloading(false);
    }
  };
  useEffect(() => {
    fetchCategory(currentPage as number, limit);
  }, [currentPage, limit]);

  const handleStatusChange = async (
    id: string,
    value: boolean,
    type: "status" | "suggested",
  ) => {
    try {
      setloading(true);

      const payload =
        type === "status" ? { status: value } : { isSuggested: value };

      const res = await myAxios.patch(`/book-category/${id}`, payload);

      setDataCategory((prev = []) =>
        prev.map((item) => (item?.categoryId === id ? res.data.result : item)),
      );

      message.success(`Success update ${type}`);
    } catch (error) {
      console.log("ERROR:", error);
      ErrorHandler(error);
    } finally {
      setloading(false);
      fetchCategory(currentPage as number, limit);
    }
  };

  const handleDelete = async () => {
    try {
      setloading(true);
      await myAxios.delete(`book-category/${selectedId}`);
      const record = dataCategory.find(
        (item) => item.categoryId === selectedId,
      );

      message.success(`Successfully delete category ${record?.name}`);
    } catch (error) {
      ErrorHandler(error);
    } finally {
      await fetchCategory(currentPage as number, limit);
      setIsModalOpen(false);
      setSelectedId("");
      setloading(false);
    }
  };

  const handleModalOpen = (categoryId: string) => {
    setIsModalOpen(true);
    setSelectedId(categoryId);
  };

  useEffect(() => {
    if (debouncedSearch) {
      const filtered = dataCategory.filter((item: CategoryProps) =>
        item.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(dataCategory);
    }
  }, [debouncedSearch, dataCategory]);
  const categoryColumns: ColumnsType<CategoryProps> = [
    {
      title: "Icon",
      dataIndex: "categoryImage",
      key: "categoryImage",

      render: (_: any, record: CategoryProps) => {
        const src = record?.categoryImage?.imageUrl || DefaultImg;
        return (
          <div
            style={{
              width: "100px",
              height: "100px",
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              src={src}
              alt={record?.name}
              style={{ objectFit: "cover", width: "100px", height: "100px" }}
            />
          </div>
        );
      },
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
      render: (text) =>
        text?.length > 80
          ? text?.slice(0, 80) + " . . . . ."
          : text || "No Content",
    },
    {
      title: "Suggested",
      dataIndex: "isSuggested",
      key: "isSuggested",
      render: (_: any, record: CategoryProps) => {
        return (
          <Switch
            loading={loading}
            value={record?.isSuggested as boolean}
            onChange={(value) => {
              handleStatusChange(record?.categoryId, value, "suggested");
            }}
            style={{
              backgroundColor: record?.isSuggested ? "lightgreen" : "gray",
            }}
          />
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_: any, record: CategoryProps) => {
        return (
          <Switch
            loading={loading}
            value={record?.status as boolean}
            onChange={(value) => {
              handleStatusChange(record?.categoryId, value, "status");
            }}
            style={{ backgroundColor: record?.status ? "lightgreen" : "gray" }}
          />
        );
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: string) => dayjs(value).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: CategoryProps) => {
        const menu = (
          <Menu
            items={[
              {
                key: "detail",
                label: "Detail",
                onClick: () => navigate(`${record.categoryId}/detail`),
              },
              {
                key: "edit",
                label: "Edit",
                onClick: () => navigate(`${record.categoryId}/edit`),
              },
              {
                key: "delete",
                label: "Delete",
                onClick: () => handleModalOpen(record.categoryId),
                danger: true,
              },
            ]}
          />
        );
        return (
          <Dropdown trigger={["click"]} overlay={menu}>
            <MoreOutlined style={{ fontSize: 20, cursor: "pointer" }} />
          </Dropdown>
        );
      },
    },
  ];
  return (
    <>
      <HeaderPage
        title="Category"
        breadcrumb="Home / Category"
        rightAction={
          <>
            <Space>
              <AppButton
                customColor="primary"
                label="Create New Category"
                onClick={() => navigate("/category/add")}
              />
            </Space>
          </>
        }
      />

      <Row>
        <Col>
          <AppInput
            icon={<SearchOutlined />}
            placeholder="Search by category name"
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
      </Row>

      <AppTable
        style={{ marginTop: 20 }}
        columns={categoryColumns}
        dataSource={filteredData}
        loading={loading}
        rowKey={"categoryId"}
        pagination={{
          current: currentPage as number,
          pageSize: limit,
          total: totalItems,
          onChange: (newPage, newPageSize) => {
            setCurrentPage(newPage);
            setLimit(newPageSize);
          },
          showSizeChanger: true,
          position: ["bottomLeft"],
          style: {},
        }}
      />

      <Modal
        title={"Delete Category"}
        children={"Are you sure want to delete this category?"}
        open={isModalOpen}
        okText="Yes"
        confirmLoading={loading}
        cancelText={"No"}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => handleDelete()}
      />
    </>
  );
};

export default Category;
