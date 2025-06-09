import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { reviewsApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, ExternalLink, Star, AlertCircle } from "lucide-react";

export default function ReviewDetail() {
  const params = useParams<{ id: string }>();
  const reviewId = parseInt(params.id || "0");

  const { data: review, isLoading, error } = useQuery({
    queryKey: [`/api/reviews/${reviewId}`],
    queryFn: () => reviewsApi.getById(reviewId),
    enabled: !isNaN(reviewId) && reviewId > 0,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const formatContent = (content: string) => {
    // Split content into paragraphs and format
    const paragraphs = content.split('\n\n').filter(p => p.trim());
    return paragraphs.map((paragraph, index) => (
      <p key={index} className="text-gray-700 leading-relaxed mb-4">
        {paragraph.trim()}
      </p>
    ));
  };

  if (isNaN(reviewId) || reviewId <= 0) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Invalid Review ID</h3>
            <p className="mt-1 text-sm text-gray-500">Please check the URL and try again.</p>
            <Link href="/">
              <Button className="mt-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Reviews
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading review</h3>
            <p className="mt-1 text-sm text-gray-500">
              {error instanceof Error ? error.message : "Something went wrong"}
            </p>
            <Link href="/">
              <Button className="mt-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Reviews
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Reviews
          </Button>
        </Link>

        {isLoading ? (
          <Card className="overflow-hidden">
            <Skeleton className="h-64 md:h-80 w-full" />
            <CardContent className="p-8">
              <div className="flex justify-between mb-6">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-5 w-48" />
                </div>
                <Skeleton className="h-10 w-32" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        ) : review ? (
          <Card className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Featured image */}
            {review.imageUrl && (
              <div className="h-64 md:h-80 overflow-hidden">
                <img
                  src={review.imageUrl}
                  alt={`${review.companyName} workspace`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <CardContent className="p-8">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div className="mb-4 md:mb-0">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {review.companyName}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>
                      <Calendar className="inline w-4 h-4 mr-1" />
                      {formatDate(review.reviewDate)}
                    </span>
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                      <span className="ml-2">{review.rating}.0/5</span>
                    </div>
                  </div>
                </div>
                <a
                  href={review.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Website
                </a>
              </div>

              {/* Review Content */}
              <div className="prose max-w-none">
                <div className="space-y-4">
                  {formatContent(review.content)}
                </div>
              </div>

              {/* Meta Information */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Review by: Anonymous Employee</span>
                  <span>Position: Employee</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Review not found</h3>
            <p className="mt-1 text-sm text-gray-500">
              The review you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/">
              <Button className="mt-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Reviews
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
