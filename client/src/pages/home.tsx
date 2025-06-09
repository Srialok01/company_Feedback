import { useQuery } from "@tanstack/react-query";
import { reviewsApi } from "@/lib/api";
import { ReviewCard } from "@/components/review-card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

export default function Home() {
  const { data: reviews, isLoading, error } = useQuery({
    queryKey: ["/api/reviews"],
    queryFn: reviewsApi.getAll,
  });

  if (error) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading reviews</h3>
            <p className="mt-1 text-sm text-gray-500">
              {error instanceof Error ? error.message : "Something went wrong"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Company Reviews</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover authentic reviews and insights about companies from our community of professionals.
          </p>
        </div>

        {/* Review Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Skeleton className="w-full h-48" />
                <div className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-16 w-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : reviews && reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No reviews found</h3>
            <p className="text-gray-500">Be the first to add a company review!</p>
          </div>
        )}
      </div>
    </div>
  );
}
