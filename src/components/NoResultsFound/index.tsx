import React from 'react';

interface NoResultsFoundProps {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    actionButton?: React.ReactNode;
}

const NoResultsFound: React.FC<NoResultsFoundProps> = ({
    title = "No results found",
    description = "We couldn't find any items matching your criteria. Try adjusting your search or filters.",
    icon,
    actionButton
}) => {
    const defaultIcon = (
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
        </svg>
    );

    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                {icon || defaultIcon}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 max-w-sm mb-4">
                {description}
            </p>
            {actionButton && (
                <div className="mt-2">
                    {actionButton}
                </div>
            )}
        </div>
    );
};

export default NoResultsFound;
