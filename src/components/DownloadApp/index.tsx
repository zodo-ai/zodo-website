import Image from "next/image";
import TransparentIconLarge from "~/svg/TransparentIconLarge.svg"; 
import QRCode from "~/svg/QrCodeWhite.svg"; 
import AppStore from "~/svg/AppstoreDownload.svg"; 
import PlayStore from "~/svg/GoogleDownloadWhite.svg"; 

const DownloadApp = () => {
  return (
    <div className="bg-white px-4 py-16 flex justify-center">
      <div className="relative w-full max-w-[85%] bg-[#255952] rounded-2xl px-8 py-12 flex flex-col md:flex-row items-center justify-between overflow-hidden">
        <Image
          src={TransparentIconLarge}
          alt="Decorative background"
          className="absolute right-0 top-0 h-full pointer-events-none"
        />
        <div className="z-10 w-full text-start md:text-left">
          <p className="text-white text-xl leading-5 font-extralight mb-2">Book Hospital Appointments In 2 Minutes</p>
          <h2 className="text-5xl font-bold text-white mb-6">Download Zodo AI Now</h2>

          <div className="flex flex-col sm:flex-row items-start md:items-center gap-4">
            <Image className="hidden md:flex" src={QRCode} alt="QR Code" width={100} height={100} />
            <div className="space-y-3 lg:space-y-0 lg:flex gap-4">
              <Image src={AppStore} alt="Download on App Store" width={120} height={40} />
              <Image src={PlayStore} alt="Get it on Google Play" width={120} height={40} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadApp;
