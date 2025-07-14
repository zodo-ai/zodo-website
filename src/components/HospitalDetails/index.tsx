import React from 'react'
import InfoCardPair from '../InfoCardPair'
import HospitalOne from "~/png/HospitalOne.png"
import { HospitalsI } from '@/network/hospitals/types'

interface HospitalDetailsProps {
    hospital?: HospitalsI | null;
    loading?: boolean;
}

const HospitalDetails = ({ hospital, loading }: HospitalDetailsProps) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B7C7B]"></div>
            </div>
        );
    }
    return (
        <InfoCardPair
            leftCard={{
                imageSrc: hospital?.logo && hospital.logo.trim() !== '' ? hospital.logo : HospitalOne,
                title: hospital?.name || 'Apollos',
                subtitle: 'multi-specialist hospital',
                rating: {
                    value: parseFloat(hospital?.avg_rating || '0'),
                    count: hospital?.rating_count || 0
                },
                location: hospital?.location || hospital?.address?.city || 'Kondapur',
                phone: hospital?.contact_details?.mobile || '',
                tag: hospital?.fastTag?.enabled ? 'Fast tag available' : 'Standard booking',
            }}
            rightCard={{
                heading: 'About Hospital',
                description: `${hospital?.name || 'This hospital'} is a multi-specialist hospital providing comprehensive healthcare services. We are committed to delivering quality medical care with state-of-the-art facilities and experienced medical professionals.`,
                readMoreLink: '#',
            }}
        />
    )
}

export default HospitalDetails
