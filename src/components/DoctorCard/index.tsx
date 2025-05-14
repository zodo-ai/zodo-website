import React from 'react';
import { DoctorCardProps } from './types';
import Image from 'next/image';
import { Button } from '../ui/button';

const DoctorCard: React.FC<DoctorCardProps> = ({ name, specialty, image, onBook }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center">
      <Image src={image} alt={name} width={230} height={182} className="object-cover mb-4" />
      <h3 className="text-xl font-semibold text-[#1B3C74]">{name}</h3>
      <p className="text-sm text-[#727C8D] my-2">{specialty}</p>
      <Button onClick={onBook} className='rounded-full bg-[#2F7269] font-bold mb-2'>
        Get Appointment
      </Button>
    </div>
  );
};

export default DoctorCard;
