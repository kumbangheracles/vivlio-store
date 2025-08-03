import { DashOutlined } from "@ant-design/icons";
import { MenuProps } from "antd";
import { BiSolidCategory } from "react-icons/bi";
import { ImBooks } from "react-icons/im";
import { TbIconsFilled } from "react-icons/tb";

const sidebarItems: MenuProps["items"] = [
  { key: "/", label: "Dashboard", icon: <DashOutlined /> },
  { key: "/category", label: "Categories", icon: <BiSolidCategory /> },
  { key: "/book", label: "Books", icon: <ImBooks /> },
  { key: "/genre", label: "Genres", icon: <TbIconsFilled /> },
];

export default sidebarItems;
