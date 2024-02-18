import React from 'react';

const ShimmerEffect = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {Array(10).fill().map((_, index) => ( // Assuming you want 10 placeholder cards
                    <div key={index} className="animate-pulse flex flex-col rounded-lg overflow-hidden shadow-lg">
                        <div className="h-56 bg-gray-300 rounded"></div>
                        <div className="flex-1 p-4 flex flex-col items-center">
                            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-300 rounded w-1/2 mb-1"></div>
                            <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShimmerEffect;
