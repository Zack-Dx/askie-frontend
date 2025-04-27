import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/Sidebar";

const Body = () => {
  return (
    <div className="flex min-h-screen bg-white">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-col flex-1 min-h-screen">
          <Navbar />
          <main className="flex-1 bg-white container mx-auto">
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Body;
