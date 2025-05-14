'use client'

import React, { useState } from 'react'
import { InfoCardPairPropsI } from './types'
import Image from 'next/image'

const InfoCardPair: React.FC<InfoCardPairPropsI> = ({ leftCard, rightCard }) => {
  const [showFullText, setShowFullText] = useState(false)

  const maxChars = 200
  const isLong = rightCard.description.length > maxChars
  const shouldShowToggle = isLong 

  const displayedText = showFullText
    ? rightCard.description
    : rightCard.description.slice(0, maxChars)

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full max-w-5xl mx-auto p-4">
      {/* Left Card */}
      <div className="flex rounded-2xl border border-[#E4E4E4] px-6 py-8 gap-6 bg-[#FAFAFA]">
        <Image
          className="rounded-xl"
          src={leftCard.imageSrc}
          alt={leftCard.title}
          width={150}
          height={168}
        />

        <div>
          <h2 className="text-base font-semibold mb-2">{leftCard.title}</h2>
          <div className="opacity-50">
            <p className="text-sm font-normal text-[#222222]">{leftCard.subtitle}</p>
            {leftCard.rating && (
              <p className="text-sm text-[#222222] mt-1">
                <span>⭐ {leftCard.rating.value}</span> | {leftCard.rating.count} Reviews
              </p>
            )}
            {leftCard.location && (
              <p className="text-sm text-[#222222] mt-1">{leftCard.location}</p>
            )}
            {leftCard.phone && (
              <p className="text-sm text-[#222222] mt-1">{leftCard.phone}</p>
            )}
            {leftCard.tag && (
              <p className="text-sm text-[#222222] mt-1">{leftCard.tag}</p>
            )}
          </div>
        </div>
      </div>

      {/* Right Card */}
      <div className="flex-[2] rounded-2xl border border-[#E4E4E4] px-6 py-8 bg-[#FAFAFA]">
        <h3 className="font-semibold text-base mb-2">{rightCard.heading}</h3>
        <p className="text-sm text-gray-600 whitespace-pre-wrap">
          {displayedText}
          {shouldShowToggle && !showFullText && '... '}
          {shouldShowToggle && (
            <button
              onClick={() => setShowFullText(!showFullText)}
              className="text-[#347D73] ml-1  hover:text-teal-700"
            >
              {showFullText ? 'show less' : 'read more'}
            </button>
          )}
        </p>
      </div>
    </div>
  )
}

export default InfoCardPair
