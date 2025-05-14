import AboutUs from "@/components/AboutUs";
import HeroTitle from "@/components/Banner";
import Download from "@/components/Download";
import DownloadApp from "@/components/DownloadApp";
import FindDoctors from "@/components/FindDoctors";
import FindHospitals from "@/components/FindHospitals";
import Mugshots from "@/components/Mugshots";
import Privacy from "@/components/Privacy";
import Reviews from "@/components/Reviews";
import Services from "@/components/Services";


const Home = () => {
  return (
    <div className="flex-1 space-y-10">
      <div className="mt-16">
        <HeroTitle />
      </div>
      <div className="my-6">
        <Download />
      </div>
      <div className="mt-36">
        <Mugshots />
      </div>
      <FindDoctors />
      <FindHospitals />
      <Services />
      <Privacy />
      <AboutUs />
      <Reviews />
      <DownloadApp />

    </div>
  );
}

export default Home;
