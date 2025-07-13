import { HospitalsI } from "@/network/hospitals/types"
import { StaticImageData } from "next/image"

export type HospitalCardPropsI = {
  hospital: HospitalsI
  onBook: () => void
}

// Legacy props for backward compatibility
export type LegacyHospitalCardPropsI = {
  name: string
  location: string
  logo: string | StaticImageData
  onBook: () => void
}