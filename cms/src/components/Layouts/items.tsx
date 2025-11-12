import { DashOutlined } from "@ant-design/icons";
import { MenuProps } from "antd";
import { BiSolidCategory } from "react-icons/bi";
import { ImBooks } from "react-icons/im";
import { TbIconsFilled } from "react-icons/tb";
import { FaUsers } from "react-icons/fa6";
import { PiArticleMediumFill } from "react-icons/pi";

const sidebarItems: MenuProps["items"] = [
  { key: "/", label: "Dashboard", icon: <DashOutlined /> },
  { key: "/category", label: "Categories", icon: <BiSolidCategory /> },
  { key: "/book", label: "Books", icon: <ImBooks /> },
  { key: "/genre", label: "Genres", icon: <TbIconsFilled /> },
  { key: "/user", label: "Users", icon: <FaUsers /> },
  { key: "/article", label: "Articles", icon: <PiArticleMediumFill /> },
];

export default sidebarItems;
