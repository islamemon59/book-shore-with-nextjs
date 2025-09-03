import AddBookForm from "./Components/AddBookForm/AddBookForm";

const AddBookPage = () => {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold tracking-tight text-neutral-content mb-2">
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
