import { authOptions } from "@/lib/authOptions";
import AddBookForm from "./Components/AddBookForm/AddBookForm";
import { getServerSession } from "next-auth";
import UnauthorizedPage from "@/app/UnauthorizedPage";
export const generateMetadata = () => {
  return {
    title: "BookShore | Dashboard | Add New Book",
  };
};
const AddBookPage = async () => {
      const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin") {
      return <UnauthorizedPage/>
    }
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold text-center tracking-tight text-primary mb-2">
        Add New Book
      </h1>
      <p className="text-lg text-neutral-content opacity-70 mb-8">
        Enter the details of a new book to add it to the inventory.
      </p>
      <AddBookForm />
    </div>
  );
};

export default AddBookPage;
