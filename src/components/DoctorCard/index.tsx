import React from 'react';
import { DoctorCardProps, LegacyDoctorCardProps } from './types';
import Image from 'next/image';
import { Button } from '../ui/button';
import { capitalizeFirstLetter } from '@/lib/utils';

function DoctorCard(props: DoctorCardProps): React.ReactElement;
function DoctorCard(props: LegacyDoctorCardProps): React.ReactElement;
function DoctorCard(props: DoctorCardProps | LegacyDoctorCardProps): React.ReactElement {
  if ('doctor' in props) {
    const { doctor, onBook } = props;
    return (
      <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center">
        {doctor.profile_pic && doctor.profile_pic.trim() !== '' ? (
          <Image
            src={doctor.profile_pic}
            alt={doctor.name}
            width={230}
            height={182}
            className="object-cover mb-4 rounded w-[230px] h-[182px]"
          />
        ) : (
          <div className="w-[230px] h-[182px] bg-gray-200 flex items-center justify-center mb-4 rounded">
            <span className="text-gray-500 text-sm">No Image</span>
          </div>
        )}
        <h3 className="text-xl font-semibold text-[#1B3C74]">{capitalizeFirstLetter(doctor.name)}</h3>
        <p className="text-sm text-[#727C8D] my-2">{capitalizeFirstLetter(doctor.city ?? "")}</p>
        <Button onClick={onBook} className='rounded-full bg-[#2F7269] font-bold mb-2'>
          View Details
        </Button>
      </div>
    );
  } else {
    const { name, specialty, image, onBook } = props;
    return (
      <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center">
        {image && (typeof image === 'string' ? image.trim() !== '' : true) ? (
          <Image src={image} alt={name} width={230} height={182} className="object-cover mb-4 rounded" />
        ) : (
          <div className="w-[230px] h-[182px] bg-gray-200 flex items-center justify-center mb-4 rounded">
            <span className="text-gray-500 text-sm">No Image</span>
          </div>
        )}
        <h3 className="text-xl font-semibold text-[#1B3C74]">{name}</h3>
        <p className="text-sm text-[#727C8D] my-2">{specialty}</p>
        <Button onClick={onBook} className='rounded-full bg-[#2F7269] font-bold mb-2'>
          View Details
        </Button>
      </div>
    );
  }
};

export default DoctorCard;
