import { FeatureCardPropsI } from './types'
import Image from 'next/image'
import ServiceOne from "~/png/ServiceOne.svg"
import ServiceTwo from "~/png/ServiceTwo.svg"
import ServiceThree from "~/png/ServiceThree.svg"
import ServiceFour from "~/png/ServiceFour.svg"
import ServiceFive from "~/png/ServiceFive.svg"

const FeatureCard = ({ icon, title, description }: FeatureCardPropsI) => {
    return (
        <div className="p-4 rounded-xl border border-[#EFF3F7] bg-white">
            <Image src={icon} width={24} height={24} alt='Icon' className='mb-16' />
            <h3 className="font-semibold text-lg text-gray-800 mb-3">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
    )
}

const FeatureGrid = () => {
    const features = [
        {
            icon: ServiceOne,
            title: 'Fast Tag Booking',
            description: 'Find the best hospitals instantly with Fast tags. Select, and book appointments effortlessly.',
        },
        {
            icon: ServiceTwo,
            title: 'Optimized for Conversions',
            description: 'No waiting, no hassle. Complete your hospital appointment booking in under 2 minutes.',
        },
        {
            icon: ServiceThree,
            title: 'Hospital Highlights at a Glance',
            description: 'Get instant access to hospital specialties, facilities, ratings, and more all in one view',
        },
        {
            icon: ServiceFour,
            title: 'Verified Hospitals Only',
            description: 'Built for speed to keep your users engaged and boost SEO.',
        },
        {
            icon: ServiceFive,
            title: '2-Minute Booking',
            description: 'Built for speed to keep your users engaged and boost SEO.',
        },
    ]

    const firstRow = features.slice(0, 3)
    const secondRow = features.slice(3)

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {firstRow.map((feature, idx) => (
                    <div key={idx} className="w-full">
                        <FeatureCard {...feature} />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {secondRow.map((feature, idx) => (
                    <div key={idx} className="w-full">
                        <FeatureCard {...feature} />
                    </div>
                ))}
            </div>
        </>
    )
}


export default FeatureGrid;