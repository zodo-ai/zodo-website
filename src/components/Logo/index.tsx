import Image from "next/image"
import Link from "next/link"
import Logo from "~/png/main_logo.png"

export const BrandLogo = () => {
    return (
        <Link href="/" className="flex items-center">
            <Image src={Logo} alt="ZODOAi Logo" width={134} height={48} priority />
        </Link>
    )
}