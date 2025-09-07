import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import CartTable from "./Components/CartTable/CartTable";


export default async function CartPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-error">You must log in to view your cart 🛒</h2>
      </div>
    );
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cart`, {
    cache: "no-store",
  });

  const data = await res.json();
  console.log("cart data" ,data);
  const cartItems = Array.isArray(data) ? data : data.data || [];

  return (
    <section className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-extrabold mb-6">🛒 Your Cart</h1>
      <CartTable items={cartItems} />
    </section>
  );
}
