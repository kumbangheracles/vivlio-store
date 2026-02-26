import AppTable from "../../components/AppTable";
import HeaderPage from "../../components/HeaderPage";
import { useNavigate } from "react-router-dom";
import { DatePicker, Dropdown, Image, Menu, Spin } from "antd";
import { BookProps } from "../../types/books.type";
import BookDefault from "../../assets/images/bookDefault.png";
import { MoreOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import myAxios from "../../helper/myAxios";
import { ErrorHandler } from "../../helper/handleError";
import { Bar } from "react-chartjs-2";
import type { ChartData } from "chart.js";
import {
  Chart as ChartJS,
  Tooltip,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

ChartJS.register(Tooltip, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setloading] = useState<boolean>(false);

  const [dataMostWishesBooks, setDataMostWishesBooks] = useState<BookProps[]>(
    [],
  );
  const [dataMostPurchasedBooks, setDataMostPurchasedBooks] = useState<
    BookProps[]
  >([]);

  const fetchBooks = async (type?: "wishes" | "purchase") => {
    try {
      setloading(true);

      if (type === "wishes") {
        const res = await myAxios.get("/books/admin-dashboard", {
          params: {
            page: "1",
            limit: "15",
            mostWishes: "true",
          },
        });

        setDataMostWishesBooks(res.data.results);
      } else if (type === "purchase") {
        const res = await myAxios.get("/books/admin-dashboard", {
          params: {
            page: "1",
            limit: "15",
            mostPurchased: "true",
          },
        });
        setDataMostPurchasedBooks(res.data.results);
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
    fetchBooks("wishes");
  }, []);

  // Purchase
  useEffect(() => {
    fetchBooks("purchase");
  }, []);

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
                onClick: () => navigate(`/book/${record.id}/detail`),
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

  // ChartJs code ====================================

  const [weeklyIncome, setWeeklyIncome] = useState<number[]>([]);
  const [monthlyIncome, setMonthlyIncome] = useState(0);

  const fetchMonthlyIncome = async (month: string) => {
    try {
      setloading(true);
      const res = await myAxios.get(
        `/transactions/admin/income?type=monthly&date=${month}`,
      );

      console.log("Raes:", res.data);

      setMonthlyIncome(Number(res.data.totalIncome) || 0);
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setloading(false);
    }
  };
  const fetchWeeklyIncome = async (selectedDate: string) => {
    try {
      setloading(true);
      const res = await myAxios.get(`/transactions/admin/income`, {
        params: {
          type: "weekly",
          date: selectedDate,
        },
      });

      const result = res.data;

      console.log("Data result income weekly: ", result);
      // const days = [
      //   "Monday",
      //   "Tuesday",
      //   "Wednesday",
      //   "Thursday",
      //   "Friday",
      //   "Saturday",
      //   "Sunday",
      // ];

      const incomePerDay = new Array(7).fill(0);

      result.forEach((item: any) => {
        const dayIndex = new Date(item.date).getDay();
        incomePerDay[dayIndex === 0 ? 6 : dayIndex - 1] = Number(
          item.totalIncome,
        );
      });

      setWeeklyIncome(incomePerDay);
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setloading(false);
    }
  };

  const lineChartData: ChartData<"bar"> = {
    labels: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ] as string[],

    datasets: [
      {
        label: "Income in this day",
        data: weeklyIncome,
        borderColor: "rgb(0, 4, 4)",
        backgroundColor: "lightblue",
      },
    ],
  };

  return (
    <>
      <HeaderPage title="Dashboard" breadcrumb="Home / Dashboard" />

      <div className="!mb-10">
        <div className="flex justify-between !p-4">
          <h4 className="text-[18px] font-semibold tracking-wide !mb-2">
            Weekly Income
          </h4>

          <DatePicker
            picker="week"
            onChange={(value) => {
              const formatted = value?.format("YYYY-MM-DD");
              if (formatted) {
                fetchWeeklyIncome(formatted);
              }
            }}
            allowClear
          />
        </div>
        <div>
          <Bar data={lineChartData} />
        </div>
      </div>
      <div className="!mb-10">
        <div className="flex justify-end">
          <DatePicker
            picker="month"
            onChange={(value) => {
              const formatted = value?.format("YYYY-MM");
              if (formatted) {
                fetchMonthlyIncome(formatted);
              }
            }}
            allowClear
          />
        </div>
        <div className="!p-4 flex justify-center items-center w-full">
          <h4 className="text-3xl bg-sky-200 rounded-2xl !p-6 w-[50%] text-center font-semibold tracking-wide !mb-2">
            {loading ? (
              <Spin />
            ) : (
              <>Total in Month Rp{monthlyIncome?.toLocaleString("id-ID")}</>
            )}
          </h4>
        </div>
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
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
