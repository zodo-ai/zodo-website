import Image from "next/image";
import Logo from "~/svg/DetailedLogo.svg";
import SocialOne from "~/svg/SocialOne.svg";
import SocialTwo from "~/svg/SocialTwo.svg";
import SocialThree from "~/svg/SocialThree.svg";
import Screenshot from "~/png/Screenshot.png";
import Gradient from "~/png/GradientGreen.png";
import OutlinedHeader from "../OutlinedHeader";
import Thunder from "~/svg/SuperThunder.svg"
import { Button } from "../ui/button";

const Footer = () => {
    const navItems = ["Home", "About us", "Contact", "Terms & Conditions", "Privacy Policy"];
    const socialIcons = [SocialOne, SocialTwo, SocialThree];

    return (
        <section className="relative w-full bg-mobile-gradient md:bg-[#004746] overflow-hidden">

            {/* Gradient Background */}
            <Image
                src={Gradient}
                alt="Background Gradient"
                fill
                priority
                className="object-cover absolute inset-0 z-10 hidden md:flex"
            />

            {/* Screenshot - floating in center */}
            <div className="relative z-20 flex flex-col justify-center items-center mt-20 ">
                <div className="text-center space-y-6 mb-4 md:mb-16">
                    <OutlinedHeader text="GET STARTED" borderColor="border-[#4CBAB1] md:border-[#004746]" icon={Thunder} paddingY="py-1" paddingX="px-2" textColor="text-white md:text-[#004746]" />
                    <h2 className=" text-white md:text-[#004746] text-6xl font-medium ">Onboard Hospital Now</h2>
                    <div className="flex justify-center">
                        <p className="font-extralight leading-6 w-3/4 text-[#8CCCCBB8] md:text-black">Launch your SaaS website in minutes. No coding, no hassle—just a
                            sleek, conversion-focused design ready to help you grow. Get started </p>
                    </div>
                    <Button className="rounded-full p-8 md:p-4 bg-[#004746]">Onboard now</Button>
                </div>

                <Image
                    src={Screenshot}
                    alt="Dashboard Screenshot"
                    width={1000}
                    height={750}
                    className="drop-shadow-2xl rounded-xl md:flex hidden"
                    priority
                />
            </div>

            {/* Footer Content */}
            <footer className="relative z-20 mt-[-50px] px-4 py-16 text-white flex flex-col items-center space-y-10">
                {/* Logo */}
                <Image
                    src={Logo}
                    alt="Zodo Ai Logo"
                    width={650}
                    height={150}
                    className="w-60 md:w-[300px]"
                    priority
                />

                {/* Navigation Pills */}
                <div className="flex flex-wrap justify-center gap-3">
                    {navItems.map((item) => (
                        <button
                            key={item}
                            className="bg-[#195654] hover:bg-[#236c6a] font-medium text-sm md:text-base px-4 py-2 rounded-full transition"
                        >
                            {item}
                        </button>
                    ))}
                </div>

                {/* Social Icons */}
                <div className="flex gap-4">
                    {socialIcons.map((Icon, idx) => (
                        <div
                            key={idx}
                            className="bg-[#195654] hover:bg-[#236c6a] p-2 rounded-full transition cursor-pointer"
                        >
                            <Image src={Icon} width={18} height={18} alt={`Social ${idx + 1}`} />
                        </div>
                    ))}
                </div>

                {/* Company Address */}
                <p className="text-sm text-center max-w-xs text-[#cbd5d7] leading-relaxed">
                    ZODO HEALTH CARE PRIVATE LIMITED, Kannur, Kerala, PIN: 673316
                </p>

                

                {/* Copyright */}
                <p className=" text-[#CCDADA]">
                    Copyright © {new Date().getFullYear()}
                </p>
            </footer>
        </section>
    );
};

export default Footer;
