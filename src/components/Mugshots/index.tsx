import Image from "next/image"
import Phones from "~/png/phones.png"
import { TrustedBy } from "../TrustedBy"
import TrustedBrands from "../TrustedBrands"

const Mugshots = () => {
    return (
        <>
            <div className="relative w-full flex justify-center mx-auto">
                <div>
                    <div className="-mb-36 flex flex-shrink">
                        <TrustedBy />
                    </div>
                    <Image
                        src={Phones}
                        alt="Mugshots"
                        width={1289}
                        height={957}
                        className="w-full max-w-[1289px] h-auto object-cover"
                    />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-[50%]" >
                    <div className="absolute bottom-0 left-0 right-0 bg-white h-full">
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
