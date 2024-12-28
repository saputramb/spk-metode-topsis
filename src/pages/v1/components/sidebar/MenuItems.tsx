import { IconCategory, IconLayoutDashboard, IconListDetails, IconLogs, IconMathSymbols, IconUser, IconUsers } from "@tabler/icons-react";
import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Home",
  },
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/",
  },
  {
    navlabel: true,
    subheader: "Menu",
  },
  {
    id: uniqueId(),
    title: "Data Siswa",
    icon: IconUsers,
    href: "/v1/views/siswa",
  },
  {
    id: uniqueId(),
    title: "Data Kriteria",
    icon: IconListDetails,
    href: "/v1/views/kriteria",
  },
  {
    id: uniqueId(),
    title: "Data Kategori",
    icon: IconCategory,
    href: "/v1/views/kategori",
  },
  {
    id: uniqueId(),
    title: "Bobot",
    icon: IconLogs,
    href: "/v1/views/bobot",
  },
  {
    id: uniqueId(),
    title: "Hasil Perhitungan",
    icon: IconMathSymbols,
    href: "/v1/views/perhitungan",
  },
  {
    navlabel: true,
    subheader: "Users",
  },
  {
    id: uniqueId(),
    title: "User",
    icon: IconUser,
    href: "/v1/views/users",
  },
];

export default Menuitems;
