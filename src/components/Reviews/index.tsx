'use client';

import Image from 'next/image';
import GreenSky from "~/png/GreenSky.png"
import OutlinedHeader from '../OutlinedHeader';
import Testimonials from '../Testimonials';

const Reviews = () => {

  return (
    <div className="relative h-[780px] w-full flex items-center justify-center overflow-hidden">
      <Image
        src={GreenSky}
        alt="Background"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-white/10 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-3xl px-4 text-center space-y-3">
      <OutlinedHeader text='REVIEWS' />

        <h2 className="text-3xl md:text-6xl font-medium mb-6 text-gray-900">
          What Other user says
        </h2>

        <Testimonials />

      </div>
    </div>
  );
};

export default Reviews;
