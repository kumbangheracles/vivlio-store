import {
  Button,
  Col,
  Dropdown,
  Image,
  Menu,
  message,
  Modal,
  Pagination,
  Row,
  Space,
  Switch,
  Table,
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
import { BaseResponseProps } from "../../types/base.type";
import { ErrorHandler } from "../../helper/handleError";
import { useDebounce } from "../../hooks/useDebounce";
import { BookProps, BookStatusType } from "../../types/books.type";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { UserProperties } from "../../types/user.type";
import BookDefault from "../../assets/images/bookDefault.png";
import AppStatusSelect from "../../components/AppStatusSelect";
const Books = () => {
  const navigate = useNavigate();
  const [dataBooks, setDataBooks] = useState<BookProps[]>([]);
  const [loading, setloading] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [search, setSearch] = useState("");
  const auth = useAuthUser<UserProperties>();
  const debouncedSearch = useDebounce(search, 500);
  const [filteredData, setFilteredData] = useState<BookProps[]>([]);
  const fetchBooks = async (page: number, limit: number) => {
    try {
      setloading(true);
      const res = await myAxios.get("/books", {
        params: { page, limit },
      });
      setDataBooks(res.data.results);
      setTotalItems(res.data.total);
    } catch (error) {
      console.log("error fetch books: ", error);
    } finally {
      setloading(false);
    }
  };
  useEffect(() => {
    console.log("Data books: ", dataBooks);
    fetchBooks(page, limit);
  }, [page, limit]);

  const handleStatusChange = async (id: string, status: BookStatusType) => {
    try {
      setloading(true);

      const res = await myAxios.patch(`/books/${id}`, { status });
      setDataBooks((prev) =>
        prev.map((item) => (item?.categoryId === id ? res.data.result : item))
      );

      message.success("Success update status");
      console.log("response: ", res.data.result);
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setloading(false);
      await fetchBooks(page, limit);
    }
  };

  const handleDelete = async () => {
    try {
      setloading(true);
      const res = await myAxios.delete(`books/${selectedId}`, {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      });
      const record = dataBooks.find((item) => item.id === selectedId);

      message.success(`Successfully delete book ${record?.title}`);
    } catch (error) {
      ErrorHandler(error);
    } finally {
      await fetchBooks(page, limit);
      setIsModalOpen(false);
      setSelectedId("");
      setloading(false);
    }
  };

  const handleModalOpen = (categoryId: string) => {
    setIsModalOpen(true);
    setSelectedId(categoryId);
  };

  // useEffect(() => {
  //   if (debouncedSearch) {
  //     const filtered = dataBooks.filter((item: CategoryProps) =>
  //       item.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  //     );
  //     setFilteredData(filtered);
  //   } else {
  //     setFilteredData(dataBooks);
  //   }
  // }, [debouncedSearch, dataBooks]);
  const bookColumns: ColumnsType<BookProps> = [
    {
      title: "Image",
      dataIndex: "images",
      key: "images",
      width: "130px",
      render: (_: any, record: BookProps) => {
        const src = record.images?.[0]?.imageUrl ?? BookDefault;

        return (
          <div
            style={{
              width: "130px",
              height: "100px",
              overflow: "hidden",
              border: "2px solid gray",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Image
              src={src}
              alt={record.title || "Default Image"}
              style={{ width: "130px", height: "100px", objectFit: "cover" }}
            />
          </div>
        );
      },
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `Rp ${price.toLocaleString("id-ID")}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_: any, record: BookProps) => {
        return (
          <AppStatusSelect
            value={record.status}
            onChange={(value) => {
              const newStatus = value as BookStatusType;
              handleStatusChange(record.id!, newStatus);
            }}
            options={Object.values(BookStatusType).map((i) => ({
              value: i,
              label: i,
              color:
                i === BookStatusType.PUBLISH
                  ? "success"
                  : i === BookStatusType.UNPUBLISH
                  ? "normal"
                  : "",
            }))}
          />
        );
      },
    },

    {
      title: "Action",
      key: "action",
      render: (_: any, record: BookProps) => {
        const menu = (
          <Menu
            items={[
              {
                key: "detail",
                label: "Detail",
                onClick: () => navigate(`${record.id}/detail`),
              },
              {
                key: "edit",
                label: "Edit",
                onClick: () => navigate(`${record.id}/edit`),
              },
              {
                key: "delete",
                label: "Delete",
                onClick: () => handleModalOpen(record.id!),
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
        columns={bookColumns}
        dataSource={dataBooks}
        loading={loading}
        rowKey={"id"}
        pagination={{
          current: page,
          pageSize: limit,
          total: totalItems,
          onChange: (newPage, newPageSize) => {
            setPage(newPage);
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
        cancelText={"No"}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => handleDelete()}
      />
    </>
  );
};

export default Books;
