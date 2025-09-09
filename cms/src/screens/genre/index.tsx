import { Col, Dropdown, Menu, message, Modal, Row, Space } from "antd";
import HeaderPage from "../../components/HeaderPage";
import AppButton from "../../components/AppButton";
import AppInput from "../../components/AppInput";
import { MoreOutlined, SearchOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import AppTable from "../../components/AppTable";
import { useNavigate } from "react-router-dom";
import myAxios from "../../helper/myAxios";
import { useEffect, useState } from "react";
import { ErrorHandler } from "../../helper/handleError";
import { useDebounce } from "../../hooks/useDebounce";
import { GenreProperties, GenreStatusType } from "../../types/genre.type";
import AppStatusSelect from "../../components/AppStatusSelect";

const GenreIndex = () => {
  const navigate = useNavigate();
  const [dataGenre, setDataGenre] = useState<GenreProperties[]>([]);
  const [loading, setloading] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [filteredData, setFilteredData] = useState<GenreProperties[]>([]);
  const fetchGenre = async (page: number, limit: number) => {
    try {
      setloading(true);
      const res = await myAxios.get("/genres", {
        params: { page, limit },
      });
      setDataGenre(res.data.results);
      setTotalItems(res.data.total);
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setloading(false);
    }
  };
  useEffect(() => {
    fetchGenre(page, limit);
  }, [page, limit]);
  console.log(dataGenre);
  const handleStatusChange = async (id: string, status: string) => {
    try {
      setloading(true);

      const res = await myAxios.patch(`/genres/${id}`, { status });
      setDataGenre((prev) =>
        prev.map((item) => (item?.genreId === id ? res.data.result : item))
      );

      message.success("Success update status");
      console.log("response: ", res.data.result);
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setloading(false);
      await fetchGenre(page, limit);
    }
  };

  const handleDelete = async () => {
    try {
      setloading(true);
      await myAxios.delete(`/genres/${selectedId}`);
      const record = dataGenre.find((item) => item.genreId === selectedId);

      message.success(`Successfully delete genre ${record?.genre_title}`);
    } catch (error) {
      ErrorHandler(error);
    } finally {
      await fetchGenre(page, limit);
      setIsModalOpen(false);
      setSelectedId("");
      setloading(false);
    }
  };

  const handleModalOpen = (genreId: string) => {
    setIsModalOpen(true);
    setSelectedId(genreId);
  };

  console.log("Genre id: ", selectedId);
  useEffect(() => {
    if (debouncedSearch) {
      const filtered = dataGenre.filter((item: GenreProperties) =>
        item.genre_title.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(dataGenre);
    }
  }, [debouncedSearch, dataGenre]);
  const genreColumns: ColumnsType<GenreProperties> = [
    {
      title: "Title",
      dataIndex: "genre_title",
      key: "genre_title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) =>
        text.length > 80
          ? text.slice(0, 80) + " . . . . ."
          : text || "No Content",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_: any, record: GenreProperties) => {
        return (
          <AppStatusSelect
            value={record.status}
            onChange={(value) => {
              const newStatus = value as GenreStatusType;
              handleStatusChange(record.genreId!, newStatus);
            }}
            options={Object.values(GenreStatusType).map((i) => ({
              value: i,
              label: i,
              color:
                i === GenreStatusType.PUBLISH
                  ? "success"
                  : i === GenreStatusType.UNPUBLISH
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
      render: (value: string) => dayjs(value).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: GenreProperties) => {
        const menu = (
          <Menu
            items={[
              {
                key: "detail",
                label: "Detail",
                onClick: () => navigate(`${record.genreId}/detail`),
              },
              {
                key: "edit",
                label: "Edit",
                onClick: () => navigate(`${record.genreId}/edit`),
              },
              {
                key: "delete",
                label: "Delete",
                onClick: () => handleModalOpen(record.genreId),
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
        title="Genres"
        breadcrumb="Home / Genre"
        rightAction={
          <>
            <Space>
              <AppButton
                customColor="primary"
                label="Create New Genre"
                onClick={() => navigate("/genre/add")}
              />
            </Space>
          </>
        }
      />

      <Row>
        <Col>
          <AppInput
            icon={<SearchOutlined />}
            placeholder="Search by genre name"
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
      </Row>

      <AppTable
        style={{ marginTop: 20 }}
        columns={genreColumns}
        dataSource={filteredData}
        loading={loading}
        rowKey={"genreId"}
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
        title={"Delete Genre"}
        children={"Are you sure want to delete this genre?"}
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

export default GenreIndex;
