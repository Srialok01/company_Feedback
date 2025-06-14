import { Link } from "wouter";
import { Calendar, ExternalLink, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Review } from "@shared/schema";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const formatDate = (date: Date | string | null) => {
    if (!date) return 'No date';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <Card className="bg-white hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {review.image_url && (
        <img
          src={review.image_url}
          alt={`${review.title} image`}
          className="w-full h-48 object-cover"
        />
      )}
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-500">
            <Calendar className="inline w-4 h-4 mr-1" />
            {formatDate(review.created_at)}
          </span>
          <div className="flex items-center">
            {renderStars(review.rating)}
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          {review.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {truncateContent(review.content)}
        </p>
        
        <div className="flex items-center justify-between">
          <Link href={`/review/${review.id}`}>
            <button className="text-primary hover:text-primary/80 font-medium text-sm">
              Read Full Review
              <ExternalLink className="inline w-4 h-4 ml-1" />
            </button>
          </Link>
          <span className="text-sm text-gray-500">
            By {review.author}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
