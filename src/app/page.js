import Banner from "./Components/Home/Components/Banner/Banner";
import FeaturedBooksSection from "./Components/Home/Components/FeaturedBooks/FeaturedBooks";
import OfferCards from "./Components/Home/Components/OfferCard/OfferCard";
import GenrePage from "./genres/page";

export const generateMetadata = () => {
  return {
    title: "BookShore | Home",
  };
};

export default function Home() {
  return (
    <div>
      <Banner/>
      <OfferCards/>
      <GenrePage/>
      <FeaturedBooksSection/>
    </div>
  );
}
