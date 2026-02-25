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
import { ErrorHandler } from "../../helper/handleError";
import {
  Tooltip,
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";
const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setloading] = useState<boolean>(false);
  const [pageWishes, setPageWishes] = useState(1);
  const [limitWishes, setLimitWishes] = useState(15);
  const [pagePurchased, setPagePurchased] = useState(1);
  const [limitPurchased, setLimitPurchased] = useState(15);
  const [totalItemsWishes, setTotalItemsWishes] = useState(0);
  const [totalItemsPurchased, setTotalItemsPurchased] = useState(0);

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

    type?: "wishes" | "purchase",
  ) => {
    try {
      setloading(true);

      if (type === "wishes") {
        const res = await myAxios.get("/books/admin-dashboard", {
          params: { page, limit, mostWishes: "true" },
        });

        setDataMostWishesBooks(res.data.results);
        setTotalItemsWishes(res.data.total);
      } else if (type === "purchase") {
        const res = await myAxios.get("/books/admin-dashboard", {
          params: { page, limit, mostPurchased: "true" },
        });

        setDataMostPurchasedBooks(res.data.results);
        setTotalItemsPurchased(res.data.total);
      }
    } catch (error) {
      console.log(error);
      ErrorHandler(error);
    } finally {
      setloading(false);
    }
  };

  // Wish
  useEffect(() => {
    fetchBooks(pageWishes, limitWishes, "wishes");
    // console.log("Data books: ", dataBooks);
  }, [pageWishes, limitWishes]);

  // Purchase
  useEffect(() => {
    fetchBooks(pagePurchased, limitPurchased, "purchase");
    // console.log("Data books: ", dataBooks);
  }, [pagePurchased, limitPurchased]);
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

      <div>
        <h4 className="text-[18px] font-semibold tracking-wide !mb-2">
          Total Income
        </h4>
      </div>
      <div className="flex gap-3 w-full flex-col">
        <div className="w-full">
          <h4 className="text-[18px] font-semibold tracking-wide !mb-2">
            Most Wishes
          </h4>
          <AppTable
            columns={bookColumns}
            className="w-full"
            dataSource={dataMostWishesBooks}
            loading={loading}
            rowKey={"id"}
            pagination={{
              current: pageWishes,
              pageSize: limitWishes,
              total: totalItemsWishes,
              onChange: (newPage, newPageSize) => {
                setPageWishes(newPage);
                setLimitWishes(newPageSize);
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
            dataSource={dataMostPurchasedBooks}
            loading={loading}
            rowKey={"id"}
            pagination={{
              current: pagePurchased,
              pageSize: limitPurchased,
              total: totalItemsPurchased,
              onChange: (newPage, newPageSize) => {
                setPagePurchased(newPage);
                setLimitPurchased(newPageSize);
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
