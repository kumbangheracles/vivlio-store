import { MoreOutlined, SearchOutlined } from "@ant-design/icons";
import { Row, Col, Modal, Image, Dropdown, Menu, Tabs, message } from "antd";
import AppInput from "../../components/AppInput";
import AppTable from "../../components/AppTable";
import HeaderPage from "../../components/HeaderPage";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import myAxios from "../../helper/myAxios";
import { ErrorHandler } from "../../helper/handleError";
import BookDefaultImg from "../../assets/images/bookDefault.png";
import AppStatusSelect from "../../components/AppStatusSelect";
import dayjs from "dayjs";
import { UserProperties } from "../../types/user.type";
import { useDebounce } from "../../hooks/useDebounce";
import {
  BookReviewsProps,
  BookReviewStatus,
} from "../../types/bookReview.type";
import AppSelect from "../../components/AppSelect";
type OptionType = "newest" | "oldest";

const ReviewsIndex = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [dataReviews, setDataReviews] = useState<BookReviewsProps[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const debouncedSearch = useDebounce(search, 500);
  const [selectedId, setSelectedId] = useState<string>("");
  const [filteredData, setFilteredData] = useState<UserProperties[]>([]);
  const LOCAL_STORAGE_KEY = "lastActiveTabKey";
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeKey, setActiveKey] = useState<BookReviewStatus>(
    BookReviewStatus.APPROVED,
  );
  const [filterValue, setFilterValue] = useState<OptionType>("newest");
  useEffect(() => {
    const savedTab = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (
      savedTab &&
      Object.values(BookReviewStatus).includes(savedTab as BookReviewStatus)
    ) {
      setActiveKey(savedTab as BookReviewStatus);
    }
  }, []);

  const fetchReviews = async (
    page: number,
    limit: number,
    status?: BookReviewStatus,
    sort?: OptionType,
  ) => {
    try {
      setLoading(true);

      const sortOrder = sort === "oldest" ? "asc" : "desc";

      const res = await myAxios.get("/book-reviews", {
        params: {
          page,
          limit,
          status,
          sortBy: "createdAt",
          sortOrder,
        },
      });

      setDataReviews(res.data.results);
      setTotalItems(res.data.total);
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setLoading(false);
    }
  };

  const updateParams = (
    updates: Record<string, string | number | undefined>,
  ) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
          params.set(key, String(value));
        } else {
          params.delete(key);
        }
      });

      return params;
    });
  };

  useEffect(() => {
    fetchReviews(page, limit, activeKey, filterValue);

    updateParams({
      page,
      limit,
      status: activeKey,
      sort: filterValue,
    });
  }, [page, limit, activeKey, filterValue]);

  const handleStatusChange = async (id: string, status: BookReviewStatus) => {
    try {
      setLoading(true);

      const res = await myAxios.patch(`/book-reviews/${id}`, { status });
      setDataReviews((prev) =>
        prev.map((item) => (item?.id === id ? res.data : item)),
      );

      message.success("Success update status");
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setLoading(false);
      await fetchReviews(page, limit, activeKey, filterValue);
    }
  };
  const handleDelete = async () => {
    try {
      setLoading(true);
      await myAxios.delete(`/book-reviews/${selectedId}`);

      message.success(`Successfully delete Reviews`);
    } catch (error) {
      ErrorHandler(error);
    } finally {
      await fetchReviews(page, limit);
      setIsModalOpen(false);
      setSelectedId("");
      setLoading(false);
    }
  };

  const handleModalOpen = (genreId: string) => {
    setIsModalOpen(true);
    setSelectedId(genreId);
  };

  const reviewColumn = [
    {
      title: "Image",
      dataIndex: "images",
      key: "images",
      render: (_: any, record: BookReviewsProps) => {
        const src = record?.book?.images?.[0]?.imageUrl ?? BookDefaultImg;

        return (
          <div
            style={{
              width: "120px",
              aspectRatio: "1 / 1",
              overflow: "hidden",
              border: "2px solid gray",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              src={src}
              alt={"book-img"}
              width={150}
              height={150}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        );
      },
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (_: any, record: BookReviewsProps) => (
        <span className="font-medium">{record?.book?.title}</span>
      ),
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      ellipsis: true,
      render: (text: string, record: BookReviewsProps) => (
        <span
          dangerouslySetInnerHTML={{
            __html:
              (record?.comment?.length as number) > 100
                ? `${text.slice(0, 100)}...`
                : text,
          }}
        ></span>
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_: any, record: BookReviewsProps) => {
        return (
          <AppStatusSelect
            value={record.status as string}
            loading={loading}
            onChange={(value) =>
              handleStatusChange(record.id as string, value as BookReviewStatus)
            }
            options={Object.values(BookReviewStatus).map((status) => ({
              value: status,
              label:
                status === BookReviewStatus.APPROVED
                  ? "Approved"
                  : status === BookReviewStatus.IS_UNDER_APPROVAL
                    ? "Under Approval"
                    : "Rejected",
              color:
                status === BookReviewStatus.APPROVED
                  ? "success"
                  : status === BookReviewStatus.IS_UNDER_APPROVAL
                    ? "warning"
                    : "error",
            }))}
          />
        );
      },
    },

    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_: any, record: BookReviewsProps) =>
        dayjs(record?.createdAt).format("YYYY-MM-DD"),
    },

    {
      title: "Action",
      key: "action",
      center: true,
      width: 80,
      render: (_: any, record: BookReviewsProps) => {
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
                onClick: () => handleModalOpen(record.id as string),
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

  const handleTabChange = (key: string) => {
    const status = key as BookReviewStatus;
    setActiveKey(status);
    localStorage.setItem(LOCAL_STORAGE_KEY, status);
  };

  const tabItems = [
    {
      label: "Approved",
      key: BookReviewStatus.APPROVED,
      children: (
        <AppTable
          style={{ marginTop: 20 }}
          columns={reviewColumn}
          dataSource={filteredData}
          loading={loading}
          rowKey="id"
          pagination={{
            current: page,
            pageSize: limit,
            total: totalItems,
            onChange: (newPage, newPageSize) => {
              setPage(newPage);
              setLimit(newPageSize);
            },
            position: ["bottomLeft"],
          }}
        />
      ),
    },
    {
      label: "Under Approval",
      key: BookReviewStatus.IS_UNDER_APPROVAL,
      children: (
        <div>
          {" "}
          <AppTable
            style={{ marginTop: 20 }}
            columns={reviewColumn}
            dataSource={filteredData}
            loading={loading}
            rowKey="id"
            pagination={{
              current: page,
              pageSize: limit,
              total: totalItems,
              onChange: (newPage, newPageSize) => {
                setPage(newPage);
                setLimit(newPageSize);
              },
              position: ["bottomLeft"],
            }}
          />
        </div>
      ),
    },
    {
      label: "Rejected",
      key: BookReviewStatus.REJECTED,
      children: (
        <div>
          {" "}
          <AppTable
            style={{ marginTop: 20 }}
            columns={reviewColumn}
            dataSource={filteredData}
            loading={loading}
            rowKey="id"
            pagination={{
              current: page,
              pageSize: limit,
              total: totalItems,
              onChange: (newPage, newPageSize) => {
                setPage(newPage);
                setLimit(newPageSize);
              },
              position: ["bottomLeft"],
            }}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (debouncedSearch) {
      const filtered = dataReviews.filter((item: BookReviewsProps) =>
        item?.book?.title
          ?.toLowerCase()
          .includes(debouncedSearch.toLowerCase()),
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(dataReviews);
    }
  }, [debouncedSearch, dataReviews]);

  return (
    <>
      <HeaderPage title="Book Reviews" breadcrumb="Home / Book Reviews" />

      <Row
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Col>
          <AppInput
            icon={<SearchOutlined />}
            placeholder="Search by Book Title"
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col>
          <AppSelect
            style={{ minWidth: 120 }}
            options={[
              { label: "Newest", value: "newest" },
              { label: "Oldest", value: "oldest" },
            ]}
            value={filterValue}
            onChange={(value) => {
              setFilterValue(value as OptionType);
              setPage(1);
            }}
          />
        </Col>
      </Row>

      <Tabs
        tabPosition="top"
        activeKey={activeKey}
        items={tabItems}
        onChange={handleTabChange}
      />

      <Modal
        title={"Delete Reviews"}
        children={"Are you sure want to delete this Reviews?"}
        open={isModalOpen}
        okText="Yes"
        cancelText={"No"}
        confirmLoading={loading}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => handleDelete()}
      />
    </>
  );
};

export default ReviewsIndex;
