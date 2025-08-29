import BannerSlider from "./BannerSlider/BannerSlider";


export default async function Banner() {
  const slides = [
    {
      id: 1,
      image: "https://susan-demo.myshopify.com/cdn/shop/files/Home-2-Slider-1.jpg?v=1613600608",
      title: "Discover Your Next Favorite Book",
      subtitle: "From programming to fiction — find books that inspire you.",
      button: "Shop Now",
    },
    {
      id: 2,
      image: "https://susan-demo.myshopify.com/cdn/shop/files/Home-2-Slider-2.png?v=1613600507",
      title: "Exclusive Discounts on Bestsellers",
      subtitle: "Save more with our limited-time offers.",
      button: "Browse Collection",
    },
    {
      id: 3,
      image: "https://susan-demo.myshopify.com/cdn/shop/files/414.jpg?v=1643262539",
      title: "Read Anytime, Anywhere",
      subtitle: "Build your personal library with BookShore.",
      button: "Start Reading",
    },
  ];

  return <BannerSlider slides={slides} />;
}
