'use client'
import { Button } from '@/components/ui/button'
import clsx from 'clsx'
import React, { useState } from 'react'
import { SearchFiltersPropsI } from './types'

const SearchFilters: React.FC<SearchFiltersPropsI> = ({ filters, onChange }) => {
    const [selected, setSelected] = useState(filters[0])

    const handleClick = (filter: string) => {
        setSelected(filter)
        onChange?.(filter)
    }

    return (
        <div className="flex gap-3 flex-wrap">
            {filters.map((filter, index) => {
                const isFirst = index === 0
                return (
                    <Button
                        key={filter}
                        onClick={() => handleClick(filter)}
                        variant={selected === filter ? 'default' : 'outline'}
                        className={clsx(
                            'py-5',
                            selected !== filter && 'bg-white text-muted-foreground text-sm',
                            isFirst ? "px-3 rounded-4xl" : 'px-5 rounded-full'
                        )}
                    >
                        {filter}
                    </Button>
                )
            })}
        </div>
    )
}

export default SearchFilters
