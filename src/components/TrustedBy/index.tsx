import Image from "next/image";
import PersonOne from "~/svg/Person1.svg"
import PersonTwo from "~/svg/Person2.svg"
import PersonThree from "~/svg/Person3.svg"

const images = [PersonOne, PersonTwo, PersonThree]

export const TrustedBy = () => {
    return (
        <div className="flex items-center gap-4">
            <div className="flex -space-x-4">
                {images.map((src, index) => (
                    <div
                        key={index}
                        className="w-12 h-12 rounded-full ring-2 ring-white overflow-hidden bg-gray-100"
                    >
                        <Image
                            src={src}
                            alt={`User ${index + 1}`}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                        />
                    </div>
                ))}
            </div>
            <span className="text-sm leading-5 text-[#004746] font-medium">
                Trusted by 30,000+  <br />
                users
            </span>
        </div>
    );
};
