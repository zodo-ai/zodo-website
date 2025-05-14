import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { HospitalCardPropsI } from './types'
import Location from "~/svg/location.svg"



const HospitalCard = ({ name, location, logo, onBook }: HospitalCardPropsI) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center">
            <Image src={logo} alt={name} width={230} height={182} className="object-cover mb-4" />
            <h3 className="text-xl font-semibold text-[#1B3C74]">{name}</h3>
            <div className='flex gap-1 mb-2'>
                <Image src={Location} alt='Location Icon' width={22} height={22} />
                <p className="text-sm text-[#727C8D] my-2">{location}</p>
            </div>
            <Button className='rounded-full bg-[#2F7269] font-bold mb-2'>
                Book now
            </Button>
        </div>
    )
}

export default HospitalCard
