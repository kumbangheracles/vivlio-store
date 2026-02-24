import AppTable from "../../components/AppTable";
import HeaderPage from "../../components/HeaderPage";
import { useNavigate } from "react-router-dom";
import { Dropdown, Image, Menu } from "antd";
import { BookProps } from "../../types/books.type";
import BookDefault from "../../assets/images/bookDefault.png";
import { MoreOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import myAxios from "../../helper/myAxios";
const Dashboard = () => {
  const navigate = useNavigate();
  const [dataBooks, setDataBooks] = useState<BookProps[]>([]);
  const [loading, setloading] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [dataMostWishesBooks, setDataMostWishesBooks] = useState<BookProps[]>(
    [],
  );
  const [dataMostPurchasedBooks, setDataMostPurchasedBooks] = useState<
    BookProps[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("");

  const fetchBooks = async (
    page: number,
    limit: number,
    search?: string,
    mostWishes?: boolean,
    mostPurchase?: boolean,
    type?: "wishes" | "purchase",
  ) => {
    try {
      setloading(true);

      if (type === "wishes") {
        const res = await myAxios.get("/books/admin", {
          params: { page, limit, search, mostWishes },
        });

        setDataMostWishesBooks(res.data.results);
        setTotalItems(res.data.total);
      } else {
        const res = await myAxios.get("/books/admin", {
          params: { page, limit, search, mostPurchase },
        });

        setDataMostPurchasedBooks(res.data.results);
        setTotalItems(res.data.total);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchBooks(page, limit);
    console.log("Data books: ", dataBooks);
  }, [page, limit]);
  const bookColumns = [
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
      render: (text: string) => (
        <p style={{ textDecoration: "underline" }}>{text}</p>
      ),
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
      width: 120,
      render: (price: number) => `Rp ${Number(price).toLocaleString("id-ID")}`,
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
      render: (_: any, record: BookProps) => {
        const menu = (
          <Menu
            items={[
              {
                key: "detail",
                label: "Detail",
                onClick: () => navigate(`${record.id}/detail`),
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
      <HeaderPage title="Dashboard" breadcrumb="Home / Dashboard" />

      <div className="flex gap-3 w-full flex-col">
        <div className="w-full">
          <h4 className="text-[18px] font-semibold tracking-wide !mb-2">
            Most Wishes
          </h4>
          <AppTable
            columns={bookColumns}
            className="w-full"
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
        </div>
        <div className="w-full">
          <h4 className="text-[18px] font-semibold tracking-wide !mb-2">
            Most Purchased Books
          </h4>
          <AppTable
            columns={bookColumns}
            className="w-full"
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
        </div>
      </div>
    </>
  );
};

export default Dashboard;
