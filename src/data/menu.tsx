import { Clock1 } from "lucide-react";
import { IconType } from "react-icons";
import { FaClock, FaMoneyBill, FaUser } from "react-icons/fa";
import {
  MdDashboard,
  MdPerson,
  MdShoppingCart,
  MdDescription,
  MdForum,
  MdAdsClick,
  MdNotifications,
  MdAnalytics,
  MdSettings,
  MdHome,
} from "react-icons/md";

interface SidebarItem {
  name: string;
  path: string;
  icon: IconType;
}

const sidebarItems: SidebarItem[] = [
  {
    name: "Home",
    path: "/",
    icon: MdHome,
  },
  {
    name: "Services",
    path: "/services",
    icon: FaClock,
  },
  {
    name: "Transactions",
    path: "/transactions",
    icon: FaMoneyBill,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: FaUser,
  },
];

export default sidebarItems;
