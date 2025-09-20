import Sidebar from "./Components/Sidebar/Sidebar";

const DashboardLayout = ({ children, pathname }) => {
  const navLinks = [
    { name: "Home", href: "/", roles: ["admin", "user"] },
    { name: "List of all books", href: "/dashboard/allbooks", roles: ["admin"] },
    { name: "Add New Book", href: "/dashboard/addProduct", roles: ["admin"] },
    { name: "View list of all orders", href: "/orders", roles: ["user"] },
    { name: "Order details", href: "/orders/details", roles: ["user"] },
    { name: "Update order status", href: "/orders/update-status", roles: ["user"] },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-base-200 text-base-content">

      <Sidebar navLinks={navLinks} pathname={pathname} />

      <main className=" flex-1 p-6 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
