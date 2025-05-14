import Image from "next/image";
import TransparentLeft from "~/svg/TransparentIcon.svg";
import TransparentRight from "~/svg/TransparentIconLarge.svg";

const Privacy = () => {
    return (
        <div className="relative bg-[#347D73] py-56 w-full text-white overflow-hidden">
            <Image
                src={TransparentLeft}
                alt="Left Decoration"
                className="absolute top-20 left-0 z-0"
                width={367}
                height={367}
            />
            <Image
                src={TransparentRight}
                alt="Right Decoration"
                className="absolute bottom-20 right-0 z-0"
                width={350}
                height={710}
            />

            <div className="relative z-10 flex flex-col items-center px-4">
                <div>
                    <h2 className="font-semibold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
                        Built with <span className="text-[#00BC72]">Privacy at <br /> the Core.</span>
                    </h2>
                    <div className="flex flex-wrap gap-8 mt-8 opacity-70 text-lg">
                        <h4>Multiple data backup</h4>
                        <h4>Data Protection Checkups</h4>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Privacy;
