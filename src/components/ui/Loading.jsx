import { motion } from "framer-motion"

const Loading = ({ className = "" }) => {
  const shimmerVariants = {
    initial: { x: "-100%" },
    animate: { 
      x: "100%",
      transition: { 
        repeat: Infinity, 
        duration: 1.5, 
        ease: "linear" 
      }
    }
  }

  const SkeletonBox = ({ className: boxClass = "" }) => (
    <div className={`bg-gray-200 rounded-lg overflow-hidden relative ${boxClass}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
        variants={shimmerVariants}
        initial="initial"
        animate="animate"
      />
    </div>
  )

  return (
    <div className={`animate-pulse space-y-6 ${className}`}>
      {/* Header skeleton */}
      <div className="space-y-3">
        <SkeletonBox className="h-8 w-64" />
        <SkeletonBox className="h-4 w-96" />
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="space-y-3">
              <SkeletonBox className="h-4 w-20" />
              <SkeletonBox className="h-8 w-16" />
              <SkeletonBox className="h-3 w-12" />
            </div>
          </div>
        ))}
      </div>

      {/* Cards grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <SkeletonBox className="h-5 w-32" />
                  <SkeletonBox className="h-4 w-24" />
                </div>
                <SkeletonBox className="h-6 w-16 rounded-full" />
              </div>
              
              <div className="space-y-2">
                <SkeletonBox className="h-4 w-full" />
                <SkeletonBox className="h-4 w-3/4" />
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <SkeletonBox className="h-4 w-20" />
                <SkeletonBox className="h-8 w-8 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Loading