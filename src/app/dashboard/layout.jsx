import { FaFileAlt } from 'react-icons/fa';
import Sidebar from './Components/Sidebar/Sidebar';

// This is a server component that handles the overall dashboard layout.
// It will dynamically render the child component based on the URL.
const DashboardLayout = ({ children, pathname }) => {
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'List of all books', href: '/books' },
    { name: 'Add New Book', href: '/books/add' },
    { name: 'View list of all orders', href: '/orders' },
    { name: 'Order details', href: '/orders/details' },
    { name: 'Update order status', href: '/orders/update-status' },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-base-200 text-base-content">
      {/* Sidebar component with navigation */}
      <Sidebar navLinks={navLinks} pathname={pathname} />

      {/* Main content area */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto">
        
        {/* Main content area with a card-like appearance */}
        <main className="w-full h-full p-6 md:p-8 bg-base-100 rounded-2xl shadow-xl">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;