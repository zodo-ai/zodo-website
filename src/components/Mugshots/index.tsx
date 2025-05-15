import Image from "next/image"
import Phones from "~/png/phones.png"
import Phone from "~/png/MobileMugshot.png"
import { TrustedBy } from "../TrustedBy"
import TrustedBrands from "../TrustedBrands"

const Mugshots = () => {
    return (
        <>
            <div className="relative w-full flex justify-center mx-auto">
                <div>
                    <div className="px-10 hidden lg:block">
                        <div className="-mb-26 flex flex-shrink">
                            <TrustedBy />
                        </div>
                        <Image
                            src={Phones}
                            alt="Mugshots"
                            width={1289}
                            height={957}
                            className="w-full max-w-[1289px] h-auto object-cover hidden lg:flex"
                        />
                    </div>
                    <div className="flex flex-col gap-10 items-center">
                        <Image src={Phone} alt="Mughshot" width={200} height={311} className="object-contain" />
                        <div className="flex flex-shrink">
                            <TrustedBy />
                        </div>
                    </div>

                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent hidden lg:flex" />
                <div className="absolute bottom-0 left-0 right-0 h-[50%] hidden lg:flex" >
                    <div className="absolute bottom-0 left-0 right-0 bg-white h-full hidden lg:flex justify-center">
                        <div className="mt-12">
                            <TrustedBrands />
                        </div>
                    </div>

                </div>

            </div>

        </>
    )
}

export default Mugshots;
