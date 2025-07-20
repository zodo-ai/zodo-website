import React from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { HospitalCardPropsI, LegacyHospitalCardPropsI } from './types'
import Location from "~/svg/location.svg"

function HospitalCard(props: HospitalCardPropsI): React.ReactElement;
function HospitalCard(props: LegacyHospitalCardPropsI): React.ReactElement;
function HospitalCard(props: HospitalCardPropsI | LegacyHospitalCardPropsI): React.ReactElement {

    if ('hospital' in props) {
        const { hospital, onBook } = props;
        return (
            <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center">
                {hospital.logo && hospital.logo.trim() !== '' ? (
                    <Image
                        src={hospital.logo}
                        alt={hospital.name}
                        width={230}
                        height={182}
                        className="object-cover mb-4 w-[230px] h-[182px]"
                    />
                ) : (
                    <div className="w-[230px] h-[182px] bg-gray-200 flex items-center justify-center mb-4 rounded">
                        <span className="text-gray-500 text-sm">No Image</span>
                    </div>
                )}
                <h3 className="text-xl font-semibold text-[#1B3C74]">{hospital.name}</h3>
                <div className='flex gap-1 mb-2'>
                    <Image src={Location} alt='Location Icon' width={22} height={22} />
                    <p className="text-sm text-[#727C8D] my-2">{hospital.location}</p>
                </div>
                <Button onClick={onBook} className='rounded-full bg-[#2F7269] font-bold mb-2'>
                    View Details
                </Button>
            </div>
        );
    } else {
        const { name, location, logo, onBook } = props;
        return (
            <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center">
                {logo && (typeof logo === 'string' ? logo.trim() !== '' : true) ? (
                    <Image src={logo} alt={name} width={230} height={182} className="object-cover mb-4" />
                ) : (
                    <div className="w-[230px] h-[182px] bg-gray-200 flex items-center justify-center mb-4 rounded">
                        <span className="text-gray-500 text-sm">No Image</span>
                    </div>
                )}
                <h3 className="text-xl font-semibold text-[#1B3C74]">{name}</h3>
                <div className='flex gap-1 mb-2'>
                    <Image src={Location} alt='Location Icon' width={22} height={22} />
                    <p className="text-sm text-[#727C8D] my-2">{location}</p>
                </div>
                <Button onClick={onBook} className='rounded-full bg-[#2F7269] font-bold mb-2'>
                    View Details
                </Button>
            </div>
        );
    }
}

export default HospitalCard
