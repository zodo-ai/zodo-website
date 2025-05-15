import { FeatureCardPropsI } from './types'
import Image from 'next/image'
import ServiceOne from "~/svg/ServiceOne.svg"
import ServiceTwo from "~/svg/ServiceTwo.svg"
import ServiceThree from "~/svg/ServiceThree.svg"
import ServiceFour from "~/svg/ServiceFour.svg"
import ServiceFive from "~/svg/ServiceFive.svg"

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

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
                <FeatureCard key={idx} {...feature} />
            ))}
        </div>
    )
}


export default FeatureGrid;