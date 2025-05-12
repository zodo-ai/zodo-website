import { HeroTitle } from "@/components/Banner";
import { Download } from "@/components/Download";
import FindDoctors from "@/components/FindDoctors";
import { Header } from "@/components/Header";
import { Mugshots } from "@/components/Mugshots";
import TrustedBrands from "@/components/TrustedBrands";
import { TrustedBy } from "@/components/TrustedBy";

const Home = () => {
  return (
    <div className="flex-1 space-y-10">
      <Header />
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

    </div>
  );
}

export default Home;
