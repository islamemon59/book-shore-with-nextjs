import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { collectionObj, dbConnect } from "@/lib/dbConnect";
import CartTable from "./Components/CartTable/CartTable";

export const generateMetadata = () => {
  return {
    title: "BookShore | Cart",
  };
};

export default async function CartPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-error">
          You must log in to view your cart 🛒
        </h2>
      </div>
    );
  }

  const cartCollection = await dbConnect(collectionObj.cartDataCollection);
  const cartItems = await cartCollection
    .find({ userEmail: session.user.email })
    .toArray();

  return (
    <section className="container mx-auto px-6">
      <CartTable items={cartItems} />
    </section>
  );
}
