'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import clsx from 'clsx';
import { CustomSearchPropsI, LocationOption } from './types';
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
    useDistricts = false,
    placeholder = 'Search'
}) => {
    const [selectedLocation, setSelectedLocation] = useState<string>('Location');
    const [query, setQuery] = useState<string>('');
    const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

    const handleSelectLocation = (location: LocationOption) => {
        if (useDistricts && typeof location === 'object') {
            setSelectedLocation(location.name);
            onLocationChange?.(location.name, (location?.id));
        } else if (typeof location === 'string') {
            setSelectedLocation(location);
            onLocationChange?.(location);
        }
        setIsPopoverOpen(false);
    };

    const getLocationKey = (location: LocationOption): string | null => {
        return typeof location === 'object' ? location?.id : location;
    };

    const getLocationName = (location: LocationOption): string => {
        return typeof location === 'object' ? location.name : location;
    };

    const isLocationSelected = (location: LocationOption): boolean => {
        const locationName = getLocationName(location);
        return locationName === selectedLocation;
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        onSearchChange?.(e.target.value);
    };

    return (
        <div className="flex w-full max-w-3xl rounded-full border shadow-xs overflow-hidden">
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger className="flex items-center px-2 sm:px-4 py-3 gap-1 sm:gap-2 text-gray-500 hover:bg-gray-100 focus:outline-none min-w-0 flex-shrink-0">
                    <MapPin />
                    <span className="text-xs sm:text-sm truncate max-w-[80px] sm:max-w-none">{selectedLocation}</span>
                    <div className="flex-shrink-0">
                        <ChevronDown />
                    </div>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2">
                    <ul className="space-y-1">
                        {locations.map((location) => (
                            <li
                                key={getLocationKey(location)}
                                className={clsx(
                                    'cursor-pointer rounded px-2 py-1 text-sm hover:bg-gray-100',
                                    isLocationSelected(location) && 'font-semibold text-green-600'
                                )}
                                onClick={() => handleSelectLocation(location)}
                            >
                                {getLocationName(location)}
                            </li>
                        ))}
                    </ul>
                </PopoverContent>
            </Popover>

            <div className="w-px bg-gray-200 my-2 flex-shrink-0" />

            <div className="flex items-center px-2 sm:px-4 py-3 flex-grow text-gray-500 min-w-0">
                <div className="flex-shrink-0">
                    <SearchIcon />
                </div>
                <Input
                    type="text"
                    placeholder={placeholder}
                    className="border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none text-xs sm:text-sm placeholder:text-gray-400 min-w-0"
                    value={query}
                    onChange={handleSearchChange}
                />
            </div>
        </div>
    );
};

export default CustomSearch;
