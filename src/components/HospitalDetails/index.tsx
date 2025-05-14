import React from 'react'
import InfoCardPair from '../InfoCardPair'
import HospitalOne from "~/png/HospitalOne.png"

const HospitalDetails = () => {
    return (
        <InfoCardPair
            leftCard={{
                imageSrc: HospitalOne,
                title: 'Apollo',
                subtitle: 'multi-specialist hospital',
                rating: { value: 4.9, count: 623 },
                location: 'Kondapur',
                phone: '+0479 232344233',
                tag: 'Fast tag available',
            }}
            rightCard={{
                heading: 'About Me',
                description: `dr. shomolu bardiga is a dentist from osun state.
he practices at general hospital he practices at general hospital he practices at general hospitalhe practices at general hospitalhe practices at general hospital`,
                readMoreLink: '#',
            }}
        />
    )
}

export default HospitalDetails
