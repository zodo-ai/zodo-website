import Image from "next/image";
import qr from "../../../public/svg/qrcode.svg";
import Google from "../../../public/svg/GoogleDownload.svg";
import Apple from "../../../public/svg/AppleDownload.svg";

const options = [
  {
    src: Apple,
    label: "Apple",
    link: "",
  },
  {
    src: Google,
    label: "Google",
    link: "",
  },
];

export const Download = () => {
  return (
    <div className="flex justify-center">
      <Image src={qr} alt="Qr code" width={136} height={136} />
      <div className="flex flex-col gap-1 justify-center">
        <p className="text-[#004746] font-bold text-3xl">
          Download <span className="text-[#00BC72]">Now</span>
        </p>
        <div className="flex gap-4">
          {options.map((option) => {
            return (
              <Image
                key={option.label}
                className="cursor-pointer"
                width={120}
                height={40}
                src={option.src}
                alt={`${option.label} Download`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
