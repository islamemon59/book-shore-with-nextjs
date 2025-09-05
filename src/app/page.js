import Banner from "./Components/Home/Components/Banner/Banner";
import OfferCards from "./Components/Home/Components/OfferCard/OfferCard";
import GenrePage from "./genres/page";

export default function Home() {
  return (
    <div>
      <Banner/>
      <OfferCards/>
      <GenrePage/>
    </div>
  );
}
