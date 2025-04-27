import {
  BotIcon,
  CircleHelpIcon,
  LayoutDashboardIcon,
  SettingsIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, NavLink } from "react-router-dom";
import { siteConfig } from "@/constants/site";
import { Badge } from "../ui/badge";
import { Icons } from "../Icons";
import { useSelector } from "react-redux";

const items = [
  {
    title: "Community",
    url: "/",
    icon: LayoutDashboardIcon,
  },
  {
    title: "My Questions",
    url: "/questions",
    icon: CircleHelpIcon,
  },
  {
    title: "Askie",
    url: "/askie",
    icon: BotIcon,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: SettingsIcon,
  },
];

export function AppSidebar() {
  const isPremium = useSelector((store) => store.user.data.isPremium);
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar>
      <SidebarContent className="bg-[#0d0d0c] text-white">
        <SidebarGroup>
          <div className="flex justify-center space-x-2 items-center">
            <h1 className="text-2xl text-center py-2 tracking-tighter font-light">
              <Link to={"/"} className="">
                {siteConfig.name}
              </Link>
            </h1>
            <div>
              {isPremium && (
                <Badge className="bg-gray-800 rounded-md">
                  <Icons.circle />
                  <span>Pro</span>
                </Badge>
              )}
            </div>
          </div>

          <hr className="opacity-20 my-2 h-1" />

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item, index) => (
                <li key={index}>
                  <NavLink
                    onClick={() => setOpenMobile(false)}
                    key={index}
                    to={item.url}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-2 py-2 text-sm text-gray-300 hover:bg-gray-700 transition my-1 rounded-md ${
                        isActive ? "bg-gray-800" : ""
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>

                    {item.url === "/askie" && (
                      <span className="inline-flex items-center gap-x-1.5 py-1 px-2 rounded-md text-xs font-medium bg-destructive text-white">
                        <span className="size-1.5 inline-block rounded-full bg-white"></span>
                        Beta
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
