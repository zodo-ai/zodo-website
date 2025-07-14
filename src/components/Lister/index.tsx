'use client';
import React, { useState } from 'react';
import { ListerProps } from './types';
import { Button } from '../ui/button';
import ChevronRight from "~/svg/ChevronRight.svg"
import Image from 'next/image';
import NoResultsFound from '../NoResultsFound';

const Lister = <T,>({
  items,
  renderItem,
  itemsPerPage = 8,
  hasMore = false,
  loading = false,
  loadingMore = false,
  onLoadMore,
  useLegacyPagination = false,
  noResultsTitle,
  noResultsDescription,
  noResultsIcon,
  noResultsAction
}: ListerProps<T>) => {
  const [visibleCount, setVisibleCount] = useState(itemsPerPage);

  const handleSeeMore = () => {
    if (useLegacyPagination) {
      setVisibleCount((prev) => prev + itemsPerPage);
    } else if (onLoadMore) {
      onLoadMore();
    }
  };

  const showSeeMoreButton = useLegacyPagination
    ? visibleCount < items.length
    : hasMore;

  const isButtonDisabled = loadingMore || loading;

  return (
    <div className="flex flex-col items-center">
      {loading && items.length === 0 && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B7C7B]"></div>
        </div>
      )}

      {/* No results found state */}
      {!loading && items.length === 0 && (
        <NoResultsFound
          title={noResultsTitle}
          description={noResultsDescription}
          icon={noResultsIcon}
          actionButton={noResultsAction}
        />
      )}

      {/* Items grid */}
      {items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
          {(useLegacyPagination ? items.slice(0, visibleCount) : items).map((item, index) => (
            <React.Fragment key={index}>{renderItem(item)}</React.Fragment>
          ))}
        </div>
      )}

      {showSeeMoreButton && items.length > 0 && (
        <Button
          className="mt-6 text-[#1B7C7B] font-medium flex items-center gap-1 px-4 py-2 border border-[#F0F4F7] rounded-full hover:border-primary transition disabled:opacity-50"
          onClick={handleSeeMore}
          variant={'outline'}
          disabled={isButtonDisabled}
        >
          {loadingMore ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#1B7C7B]"></div>
              <label>Loading...</label>
            </>
          ) : (
            <>
              <label>See More</label>
              <Image src={ChevronRight} alt='Right' className='w-4 h-4' />
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default Lister;
