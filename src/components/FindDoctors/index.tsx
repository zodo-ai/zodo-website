'use client'
import React from 'react'
import OutlinedHeader from '../OutlinedHeader'
import CustomHead from '../CustomHead'
import CustomSearch from '../CustomSearch'
import Lister from '../Lister'
import DoctorCard from '../DoctorCard'
import DoctorOne from "~/png/DoctorOne.png";
import DoctorTwo from "~/png/DoctorTwo.png"
import DoctorThree from "~/png/DoctorThree.png"
import DoctorFour from "~/png/DoctorFour.png"

const doctors = [
    { name: 'Dr. Norman Colins', specialty: 'Dental Surgeon', image: DoctorOne },
    { name: 'Dr. Steven Lee', specialty: 'Cardiology', image: DoctorTwo },
    { name: 'Dr. David Kim', specialty: 'Dental Surgeon', image: DoctorThree },
    { name: 'Dr. Johan Smith', specialty: 'Orthopedic', image: DoctorFour },
    { name: 'Dr. Norman Colins', specialty: 'Dental Surgeon', image: DoctorOne },
    { name: 'Dr. Steven Lee', specialty: 'Cardiology', image: DoctorTwo },
    { name: 'Dr. David Kim', specialty: 'Dental Surgeon', image: DoctorThree },
    { name: 'Dr. Johan Smith', specialty: 'Orthopedic', image: DoctorFour },
    { name: 'Dr. Norman Colins', specialty: 'Dental Surgeon', image: DoctorOne },
    { name: 'Dr. Steven Lee', specialty: 'Cardiology', image: DoctorTwo },
    { name: 'Dr. David Kim', specialty: 'Dental Surgeon', image: DoctorThree },
    { name: 'Dr. Johan Smith', specialty: 'Orthopedic', image: DoctorFour },


];

const FindDoctors = () => {
    return (
        <div className='flex flex-col justify-center items-center gap-4'>
            <div>
                <OutlinedHeader text='EASY AND FAST BOOKING' />
            </div>
            <CustomHead text='Find For Doctors' highlight='Doctors' />
            <div className='mb-10 flex justify-center w-full items-center'>
                <CustomSearch
                    locations={['Bangalore', 'Chennai', 'Delhi']}
                    onLocationChange={(loc) => console.log('Selected:', loc)}
                    onSearchChange={(q) => console.log('Search Query:', q)}
                />
            </div>

            <section className="max-w-7xl mx-auto px-4 mb-20">
                <Lister
                    items={doctors}
                    renderItem={(doctor) => (
                        <DoctorCard
                            name={doctor.name}
                            specialty={doctor.specialty}
                            image={doctor.image}
                        />
                    )}
                />
            </section>
        </div>
    )
}

export default FindDoctors