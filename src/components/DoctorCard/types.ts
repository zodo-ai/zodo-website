import { StaticImageData } from "next/image";

export type DoctorCardProps = {
  name: string;
  specialty: string;
  image: string | StaticImageData;
};