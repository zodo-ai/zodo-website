'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import clsx from 'clsx';
import { CustomSearchPropsI } from './types';
import Location from "~/svg/location.svg"
import Search from "~/svg/search.svg"
import Chevron from "~/svg/ChevronDown.svg"
import Image from 'next/image';

const MapPin = () => <Image src={Location} alt='location' className='w-6 h-6' />
const SearchIcon = () => <Image src={Search} alt='Search' className='w-6 h-6 mr-2' />
const ChevronDown = () => <Image src={Chevron} alt='Down' className='w-5 h-5' />



const CustomSearch: React.FC<CustomSearchPropsI> = ({
    locations,
    onLocationChange,
    onSearchChange,
}) => {
    const [selectedLocation, setSelectedLocation] = useState<string>('Location');
    const [query, setQuery] = useState<string>('');

    const handleSelectLocation = (location: string) => {
        setSelectedLocation(location);
        onLocationChange?.(location);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        onSearchChange?.(e.target.value);
    };

    return (
        <div className="flex w-full max-w-3xl rounded-full border shadow-xs overflow-hidden">
            <Popover>
                <PopoverTrigger className="flex items-center px-4 py-3 gap-2 text-gray-500 hover:bg-gray-100 focus:outline-none">
                    <MapPin />
                    <span className="text-sm">{selectedLocation}</span>
                    <ChevronDown />
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2">
                    <ul className="space-y-1">
                        {locations.map((location) => (
                            <li
                                key={location}
                                className={clsx(
                                    'cursor-pointer rounded px-2 py-1 text-sm hover:bg-gray-100',
                                    location === selectedLocation && 'font-semibold text-green-600'
                                )}
                                onClick={() => handleSelectLocation(location)}
                            >
                                {location}
                            </li>
                        ))}
                    </ul>
                </PopoverContent>
            </Popover>

            <div className="w-px bg-gray-200 my-2" />

            <div className="flex items-center px-4 py-3 flex-grow text-gray-500">
                <SearchIcon />
                <Input
                    type="text"
                    placeholder="Search doctor, Hospital"
                    className="border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none text-sm placeholder:text-gray-400"
                    value={query}
                    onChange={handleSearchChange}
                />
            </div>
        </div>
    );
};

export default CustomSearch;
