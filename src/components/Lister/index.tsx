'use client';
import React, { useState } from 'react';
import { ListerProps } from './types';
import { Button } from '../ui/button';
import ChevronRight from "~/svg/ChevronRight.svg"
import Image from 'next/image';

const Lister = <T,>({ items, renderItem, itemsPerPage = 8 }: ListerProps<T>) => {
  const [visibleCount, setVisibleCount] = useState(itemsPerPage);

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + itemsPerPage);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
        {items.slice(0, visibleCount).map((item, index) => (
          <React.Fragment key={index}>{renderItem(item)}</React.Fragment>
        ))}
      </div>

      {visibleCount < items.length && (
        <Button
          className="mt-6 text-[#1B7C7B] font-medium flex items-center gap-1 px-4 py-2 border border-[#F0F4F7] rounded-full hover:border-primary transition"
          onClick={handleSeeMore}
          variant={'outline'}
        >
            <label>See More</label>
            <Image src={ChevronRight} alt='Right' className='w-4 h-4' />
        </Button>
      )}
    </div>
  );
};

export default Lister;
