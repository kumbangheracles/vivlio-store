import { DashOutlined } from "@ant-design/icons";
import { MenuProps } from "antd";
import { BiSolidCategory } from "react-icons/bi";
import { ImBooks } from "react-icons/im";

const sidebarItems: MenuProps["items"] = [
  { key: "/", label: "Dashboard", icon: <DashOutlined /> },
  { key: "/category", label: "Category", icon: <BiSolidCategory /> },
  { key: "/book", label: "Books", icon: <ImBooks /> },
];

export default sidebarItems;
