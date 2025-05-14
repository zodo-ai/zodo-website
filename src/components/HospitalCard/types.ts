import { StaticImageData } from "next/image"

export type HospitalCardPropsI = {
  name: string
  location: string
  logo: string | StaticImageData
  onBook: () => void
}