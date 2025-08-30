import Image from "next/image";
import Link from "next/link"; // Added Link for clickable cards

const offers = [
  {
    id: 1,
    image:
      "https://susan-demo.myshopify.com/cdn/shop/files/Banner-600x350-Collection-1.png?v=1613600610",
    title: "Bestseller Book",
    subtitle: "Top pick for readers",
    price: "$25",
    link: "/books/bestsellers", // Added link for navigation
  },
  {
    id: 2,
    image:
      "https://susan-demo.myshopify.com/cdn/shop/files/Banner-600x350-Collection-2.png?v=1613600610",
    title: "New Arrival",
    subtitle: "Discover the latest books",
    price: "$30",
    link: "/books/new-arrivals", // Added link for navigation
  },
  {
    id: 3,
    image:
      "https://susan-demo.myshopify.com/cdn/shop/files/Banner-600x350-Collection-3.png?v=1613600610",
    title: "Special Discount",
    subtitle: "Limited time offer",
    price: "$18",
    link: "/books/special-offers", // Added link for navigation
  },
];

export default function OfferCards() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {offers.map((offer) => (
          <Link
            key={offer.id}
            href={offer.link}
            className="group block rounded-xl overflow-hidden shadow-lg transition-transform duration-300 ease-in-out hover:scale-[1.03] hover:shadow-2xl"
          >
            <div className="relative w-full h-64">
              <Image
                src={offer.image}
                alt={offer.title}
                fill
                className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              />
            </div>

            <div className="p-6 text-center bg-white">
              <h3 className="text-2xl font-bold tracking-tight text-[#3489BD] mb-1">
                {offer.title}
              </h3>
              <p className="text-[#144D75] mb-3">{offer.subtitle}</p>
              <p className="text-xl font-extrabold text-[#2E7A7A]">
                {offer.price}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
