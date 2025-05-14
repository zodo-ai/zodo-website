import { StaticImageData } from "next/image"

export type LeftCardInfoI = {
  imageSrc: StaticImageData
  title: string
  subtitle: string
  rating?: {
    value: number
    count: number
  }
  location?: string
  phone?: string
  tag?: string
}

export type RightCardInfoI = {
  heading: string
  description: string
  readMoreLink?: string
}

export type InfoCardPairPropsI = {
  leftCard: LeftCardInfoI
  rightCard: RightCardInfoI
}