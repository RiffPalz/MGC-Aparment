export default function PageLoader() {
  return (
    <div className="min-h-screen w-full bg-white animate-pulse overflow-hidden flex flex-col">
      {/* Universal Header Skeleton */}
      <div className="h-16 sm:h-20 bg-slate-50 w-full border-b border-slate-100" />
      
      {/* Universal Body Skeleton */}
      <div className="flex-1 w-full p-4 sm:p-8 md:p-12 flex flex-col gap-4 sm:gap-6 max-w-7xl mx-auto mt-2 sm:mt-4">
        {/* Fake Page Title */}
        <div className="h-10 sm:h-12 bg-slate-100 rounded-2xl w-2/3 max-w-sm" />
        
        {/* Fake Main Content Area (Table/Cards) */}
        <div className="h-64 sm:h-96 bg-slate-100 rounded-3xl w-full" />
        
        {/* Fake Bottom Elements */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="h-8 bg-slate-100 rounded-xl w-full sm:w-1/4" />
          <div className="h-8 bg-slate-100 rounded-xl w-full sm:w-1/2" />
        </div>
      </div>
    </div>
  );
}