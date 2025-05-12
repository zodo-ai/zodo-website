import React from 'react';
import { CustomHeadPropsI } from './types';



const CustomHead = ({ text, highlight }: CustomHeadPropsI) => {
  const parts = text.split(new RegExp(`(${highlight})`, 'i'));

  return (
    <h2 className="text-4xl md:text-6xl font-semibold text-[#004746]">
      {parts.map((part, index) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={index} className="text-[#00BC72]">{part}</span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </h2>
  );
};

export default CustomHead;
