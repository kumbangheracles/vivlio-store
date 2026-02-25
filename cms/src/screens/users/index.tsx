import {
  Col,
  Dropdown,
  Image,
  Menu,
  message,
  Modal,
  Row,
  Space,
  Spin,
  Switch,
  Tag,
  Typography,
} from "antd";
import HeaderPage from "../../components/HeaderPage";
import AppButton from "../../components/AppButton";
import AppInput from "../../components/AppInput";
import { MoreOutlined, SearchOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import AppTable from "../../components/AppTable";
import { useNavigate, useSearchParams } from "react-router-dom";
import myAxios from "../../helper/myAxios";
import { useEffect, useState } from "react";
import { ErrorHandler } from "../../helper/handleError";
import DefaultImage from "../../assets/images/profile-default.jpg";
import { UserProperties } from "../../types/user.type";
// import { useDebouncedFilter } from "../../hooks/useDebounceFiltered";
import { RoleProperties } from "../../types/role.type";
import { useDebounce } from "../../hooks/useDebounce";
import { SortDateKey } from "../books";
import AppSelect from "../../components/AppSelect";
type SortRoleUser = "admin" | "super_admin" | "customer";
const { Text } = Typography;
const UserIndex = () => {
  const navigate = useNavigate();
  const [dataUser, setdataUser] = useState<UserProperties[]>([]);
  const [loading, setloading] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [filteredData, setFilteredData] = useState<UserProperties[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState<SortDateKey | null>(null);
  const [sortRole, setSortRole] = useState<SortRoleUser | null>(null);
  const [sortStatus, setSortStatus] = useState<boolean | null>(null);
  const updateParams = (
    updates: Record<string, string | number | undefined | null | boolean>,
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
  const fetchUsers = async (
    page: number,
    limit: number,
    search?: string,
    status?: boolean,
    sortDate?: SortDateKey | null,
    roleName?: SortRoleUser | null,
  ) => {
    try {
      setloading(true);
      const res = await myAxios.get("/users", {
        params: {
          page,
          limit,
          username: search,
          sortDate,
          isActive: status,
          roleName,
        },
      });
      const resRole = await myAxios.get("/roles");
      const role = resRole.data.results;
      // setDataRole(role);
      const usersWithRoleName = res.data.results.map((user: UserProperties) => {
        const matchedRole = role.find(
          (role: RoleProperties) => role.id === user.roleId,
        );
        return {
          ...user,
          roleName: matchedRole?.name || "Unknown",
        };
      });
      console.log("data users: ", usersWithRoleName);
      setdataUser(usersWithRoleName);
      setTotalItems(res.data.total);
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setloading(false);
    }
  };
  useEffect(() => {
    fetchUsers(
      page,
      limit,
      debouncedSearch,
      sortStatus as boolean,
      sort,
      sortRole,
    );

    updateParams({ page, limit, debouncedSearch, sortStatus, sort, sortRole });
  }, [page, limit, debouncedSearch, sortStatus, sort, searchParams, sortRole]);

  const handleStatusChange = async (
    id: string,
    isActive: boolean,
    username?: string,
  ) => {
    if (username === "herkalsuperadmin") {
      return message.info("this user cannot be inactivated");
    }

    try {
      setloading(true);

      await myAxios.patch(`/users/${id}`, { isActive });
      setdataUser((prev) =>
        prev.map((item) =>
          item?.id === id ? { ...item, isActive: isActive } : item,
        ),
      );

      message.success("Success update status");
    } catch (error) {
      ErrorHandler(error);
    } finally {
      await fetchUsers(page, limit);
      setloading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setloading(true);
      await myAxios.delete(`/users/${selectedId}`);
      const record = dataUser.find((item) => item.id === selectedId);

      message.success(`Successfully delete user ${record?.username}`);
    } catch (error) {
      ErrorHandler(error);
    } finally {
      await fetchUsers(page, limit);
      setIsModalOpen(false);
      setSelectedId("");
      setloading(false);
    }
  };

  const handleModalOpen = (genreId: string) => {
    setIsModalOpen(true);
    setSelectedId(genreId);
  };

  const userColumn: ColumnsType<UserProperties> = [
    {
      title: "Profile Image",
      dataIndex: "profileImage",
      key: "profileImage",
      render: (_: any, record: UserProperties) => {
        const src = record.profileImage?.imageUrl || DefaultImage;

        return (
          <div
            style={{
              width: 70,
              height: 70,
              border: "3px solid gray",
              borderRadius: "50%",
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {loading ? (
              <Spin />
            ) : (
              <Image src={`${src}?v=${Date.now()}`} alt={record.username} />
            )}
          </div>
        );
      },
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (text: string) => (
        <Text style={{ textDecoration: "underline" }}>{text}</Text>
      ),
    },
    {
      title: "Role",
      dataIndex: "roleName",
      key: "roleName",
      render: (text: string) => <Tag>{text}</Tag>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (_: any, record: UserProperties) => {
        return (
          <Switch
            disabled={record?.roleName === "super_admin"}
            value={record.isActive!}
            onChange={(value) => {
              handleStatusChange(
                record.id as string,
                value as boolean,
                record.roleName as string,
              );
            }}
            style={{
              backgroundColor:
                record.roleName === "super_admin"
                  ? "#76b4e6"
                  : record.isActive
                    ? "lightgreen"
                    : "gray",
            }}
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
      render: (_: any, record: UserProperties) => {
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

  // const filterUser = (user: UserProperties, key: string) => {
  //   return user.username!.toLowerCase().includes(key.toLowerCase());
  // };

  // const filteredUsers = useDebouncedFilter<UserProperties>(
  //   dataUser,
  //   search,
  //   filterUser,
  //   500,
  //   setloading
  // );
  useEffect(() => {
    if (debouncedSearch) {
      const filtered = dataUser.filter((item: UserProperties) =>
        item.username?.toLowerCase().includes(debouncedSearch.toLowerCase()),
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(dataUser);
    }
  }, [debouncedSearch, dataUser]);
  return (
    <>
      <HeaderPage
        title="Users"
        breadcrumb="Home / User"
        rightAction={
          <>
            <Space>
              <AppButton
                customColor="primary"
                label="Create New User"
                onClick={() => navigate("/user/add")}
              />
            </Space>
          </>
        }
      />

      <Row justify={"space-between"}>
        <Col>
          <AppInput
            icon={<SearchOutlined />}
            placeholder="Search by username"
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col className="flex items-center gap-2">
          <div className="flex gap-2 items-center rounded-md !px-3 !py-2  text-black border border-gray-200">
            <h4>Active Only</h4>
            <Switch
              loading={loading}
              value={sortStatus as boolean}
              onChange={() => setSortStatus((prev) => !prev)}
              style={{
                backgroundColor: sortStatus ? "lightgreen" : "gray",
              }}
            />
          </div>

          <AppSelect
            placeholder="Filter By Latest"
            value={sort}
            loading={loading}
            options={[
              { label: "Newest Saved", value: "newest_saved" },
              { label: "Oldest Saved", value: "oldest_saved" },
            ]}
            onChange={(value) => setSort(value)}
          />
          <AppSelect
            placeholder="Filter By Role"
            value={sortRole}
            loading={loading}
            style={{ minWidth: 130 }}
            options={[
              { label: "Admin", value: "admin" },
              { label: "Super Admin", value: "super_admin" },
              { label: "Customer", value: "customer" },
              { label: "All Role", value: null },
            ]}
            onChange={(value) => setSortRole(value)}
          />
        </Col>
      </Row>

      <AppTable
        style={{ marginTop: 20 }}
        columns={userColumn}
        dataSource={filteredData}
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
        title={"Delete User"}
        children={"Are you sure want to delete this user?"}
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

export default UserIndex;
