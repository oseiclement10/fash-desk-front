
const SkeletonLoad = () => {
    return (
        <div className="p-6 space-y-6 animate-pulse">
            {/* Header */}
            <div className="h-8 w-1/3 bg-gray-200 rounded-lg" />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-28 bg-gray-200 rounded-2xl" />
                ))}
            </div>

            {/* Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-64 bg-gray-200 rounded-2xl" />
                <div className="h-64 bg-gray-200 rounded-2xl" />
            </div>

            {/* Table Section */}
            <div className="bg-gray-200 rounded-2xl p-4 space-y-3">
                <div className="h-6 w-1/4 bg-background/60 rounded-md" />
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-5 w-full bg-background/40 rounded-md" />
                ))}
            </div>
        </div>
    );
};

export default SkeletonLoad;
