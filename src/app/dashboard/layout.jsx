import Sidebar from "./Components/Sidebar/Sidebar";

const DashboardLayout = ({ children, pathname }) => {
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "List of all books", href: "/dashboard/allbooks" },
    { name: "Add New Book", href: "/dashboard/addProduct" },
    { name: "View list of all orders", href: "/orders" },
    { name: "Order details", href: "/orders/details" },
    { name: "Update order status", href: "/orders/update-status" },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-base-200 text-base-content">
      {/* Sidebar component with navigation */}
      <Sidebar navLinks={navLinks} pathname={pathname} />

      {/* Main content area */}
      <main className=" flex-1 p-6 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
