import { StaticImageData } from "next/image";
import { DoctorI } from "@/network/doctors/types";

export type DoctorCardProps = {
  doctor: DoctorI;
  onBook: () => void;
}

// Legacy props for backward compatibility
export type LegacyDoctorCardProps = {
  name: string;
  specialty: string;
  image: string | StaticImageData;
  onBook: () => void;
};