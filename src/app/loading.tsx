export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero skeleton */}
      <div className="relative min-h-[100dvh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        <div className="relative z-10 px-5 sm:px-8 md:px-12 lg:px-24 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-end pb-12 md:pb-0">
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            <div className="h-4 w-32 bg-gray-300 rounded animate-pulse" />
            <div className="h-16 sm:h-24 md:h-32 w-3/4 bg-gray-300 rounded animate-pulse" />
            <div className="h-4 w-full max-w-xl bg-gray-300 rounded animate-pulse" />
            <div className="h-4 w-2/3 max-w-xl bg-gray-300 rounded animate-pulse" />
            <div className="flex gap-6 mt-8">
              <div className="h-12 w-24 bg-gray-300 rounded animate-pulse" />
              <div className="h-12 w-24 bg-gray-300 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Services skeleton */}
      <section className="bg-white pt-8 sm:pt-12 md:pt-16 pb-8 sm:pb-12 px-5 sm:px-8 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-8 md:mb-12 space-y-3">
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-1 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio skeleton */}
      <section className="bg-white pt-0 sm:pt-4 md:pt-8 pb-8 sm:pb-12 px-5 sm:px-8 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex justify-between items-end mb-10 sm:mb-16 border-b border-gray-200 pb-6 sm:pb-8">
            <div className="space-y-3">
              <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex flex-col sm:flex-row lg:grid lg:grid-cols-12 gap-4 sm:gap-4 lg:gap-6 lg:auto-rows-[300px]">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="lg:col-span-6 bg-gray-200 rounded-xl h-[250px] sm:h-[300px] animate-pulse" />
            ))}
          </div>
        </div>
      </section>

      {/* Contact skeleton */}
      <section className="bg-white pt-12 sm:pt-16 pb-16 sm:pb-24 md:pb-32 px-5 sm:px-8 md:px-12">
        <div className="max-w-[1200px] mx-auto bg-gray-50 p-6 sm:p-8 md:p-12 lg:p-24 rounded-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
            <div className="space-y-4">
              <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="space-y-4">
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-12 w-full bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
