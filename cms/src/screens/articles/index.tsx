import { MoreOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Space,
  Row,
  Col,
  Modal,
  Tag,
  Image,
  Dropdown,
  Menu,
  message,
} from "antd";
import AppButton from "../../components/AppButton";
import AppInput from "../../components/AppInput";
import AppTable from "../../components/AppTable";
import HeaderPage from "../../components/HeaderPage";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import myAxios from "../../helper/myAxios";
import { ErrorHandler } from "../../helper/handleError";
import { ArticleProperties, ArticleStatusType } from "../../types/article.type";
import DefaultImage from "../../assets/images/default-img.png";
import AppStatusSelect from "../../components/AppStatusSelect";
import dayjs from "dayjs";
import { UserProperties } from "../../types/user.type";
import { useDebounce } from "../../hooks/useDebounce";

const ArticleIndex = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [dataArticle, setDataArticle] = useState<ArticleProperties[]>([]);
  const [dataUser, setDataUser] = useState<UserProperties[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const debouncedSearch = useDebounce(search, 500);
  const [selectedId, setSelectedId] = useState<string>("");
  const [filteredData, setFilteredData] = useState<UserProperties[]>([]);
  const fetchArticles = async (page: number, limit: number) => {
    try {
      setLoading(true);
      const res = await myAxios.get("/articles", {
        params: { page, limit },
      });

      setDataArticle(res.data.results);
      setTotalItems(res.data.total);
      console.log("Data articles: ", res.data);
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchArticles(page, limit);
  }, [page, limit]);

  useEffect(() => {
    if (dataArticle.length > 0) {
      // ambil semua id unik
      const uniqueAdminIds = [
        ...new Set(dataArticle.map((a) => a.createdByAdminId)),
      ];

      const fetchAllUsers = async () => {
        try {
          setLoading(true);
          const promises = uniqueAdminIds.map((id) =>
            myAxios.get(`/users/${id}`)
          );
          const responses = await Promise.all(promises);

          const users = responses.map((res) => res.data.result);
          setDataUser(users); // ubah jadi array kalau mau tampung banyak user

          console.log("Fetched users:", users);
        } catch (error) {
          ErrorHandler(error);
        } finally {
          setLoading(false);
        }
      };

      fetchAllUsers();
    }
  }, [dataArticle]);
  const handleDelete = async () => {
    try {
      setLoading(true);
      await myAxios.delete(`/articles/${selectedId}`);

      message.success(`Successfully delete article`);
    } catch (error) {
      ErrorHandler(error);
    } finally {
      await fetchArticles(page, limit);
      setIsModalOpen(false);
      setSelectedId("");
      setLoading(false);
    }
  };

  const handleModalOpen = (genreId: string) => {
    setIsModalOpen(true);
    setSelectedId(genreId);
  };

  const articleColumn = [
    {
      title: "Image",
      dataIndex: "articleImages",
      key: "articleImages",
      width: 120,
      render: (_: any, record: ArticleProperties) => {
        const src = record.articleImages?.imageUrl || DefaultImage;

        return (
          <div
            style={{
              width: "100px",
              height: "100px",
              overflow: "hidden",
              border: "2px solid gray",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src={src}
              alt={record.title}
              style={{ width: "100%", height: "100px", objectFit: "cover" }}
            />
          </div>
        );
      },
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (text: string) => (
        <span
          dangerouslySetInnerHTML={{
            __html: text?.length > 100 ? `${text.slice(0, 100)}...` : text,
          }}
        ></span>
      ),
    },
    {
      title: "Created By",
      dataIndex: "createdByAdminId",
      key: "createdByAdminId",
      width: 130,

      render: (_: any, record: ArticleProperties) => {
        const user = dataUser.find(
          (item) => item.id === record.createdByAdminId
        );
        return <Tag>{user ? user.username : "Unknown"}</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_: any, record: ArticleProperties) => {
        return (
          <AppStatusSelect
            value={record.status as string}
            onChange={(value) => {
              const newStatus = value as ArticleStatusType;
              // handleStatusChange(record.id!, newStatus);
            }}
            options={Object.values(ArticleStatusType).map((i) => ({
              value: i,
              label: i,
              color:
                i === ArticleStatusType.PUBLISH
                  ? "success"
                  : i === ArticleStatusType.UNPUBLISH
                  ? "normal"
                  : "",
            }))}
          />
        );
      },
    },

    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: string) => dayjs(value).format("YYYY-MM-DD"),
    },

    {
      title: "Action",
      key: "action",
      center: true,
      width: 80,
      render: (_: any, record: ArticleProperties) => {
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

  useEffect(() => {
    if (debouncedSearch) {
      const filtered = dataArticle.filter((item: ArticleProperties) =>
        item.title?.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(dataArticle);
    }
  }, [debouncedSearch, dataArticle]);
  return (
    <>
      <HeaderPage
        title="Articles"
        breadcrumb="Home / Article"
        rightAction={
          <>
            <Space>
              <AppButton
                customColor="primary"
                label="Create New Article"
                onClick={() => navigate("/article/add")}
              />
            </Space>
          </>
        }
      />

      <Row>
        <Col>
          <AppInput
            icon={<SearchOutlined />}
            placeholder="Search by title"
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
      </Row>

      <AppTable
        style={{ marginTop: 20 }}
        columns={articleColumn}
        dataSource={filteredData}
        // dataSource={dataArticle}
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
          // showSizeChanger: true,
          position: ["bottomLeft"],
          style: {},
        }}
      />

      <Modal
        title={"Delete Article"}
        children={"Are you sure want to delete this article?"}
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

export default ArticleIndex;
