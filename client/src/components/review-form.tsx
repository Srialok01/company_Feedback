import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertReviewSchema, type InsertReview } from "@shared/schema";
import { reviewsApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CloudUpload, Star, Save, X } from "lucide-react";
import type { Review } from "@shared/schema";

interface ReviewFormProps {
  review?: Review;
  onSuccess?: () => void;
  onCancel?: () => void;
}

type FormData = InsertReview & { image?: File };

export function ReviewForm({ review, onSuccess, onCancel }: ReviewFormProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    review?.imageUrl || null
  );
  const [selectedRating, setSelectedRating] = useState(review?.rating || 0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(insertReviewSchema.extend({ image: insertReviewSchema.shape.imageUrl.optional() })),
    defaultValues: {
      companyName: review?.companyName || "",
      reviewDate: review?.reviewDate || new Date().toISOString().split('T')[0],
      content: review?.content || "",
      websiteUrl: review?.websiteUrl || "",
      rating: review?.rating || 1,
    },
  });

  const createMutation = useMutation({
    mutationFn: reviewsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      toast({ title: "Success", description: "Review created successfully" });
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to create review",
        variant: "destructive" 
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<FormData>) => reviewsApi.update(review!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      queryClient.invalidateQueries({ queryKey: [`/api/reviews/${review!.id}`] });
      toast({ title: "Success", description: "Review updated successfully" });
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to update review",
        variant: "destructive" 
      });
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: FormData) => {
    const submitData = {
      ...data,
      rating: selectedRating,
      ...(selectedImage && { image: selectedImage }),
    };

    if (review) {
      updateMutation.mutate(submitData);
    } else {
      createMutation.mutate(submitData as InsertReview & { image?: File });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{review ? "Edit Review" : "Add New Review"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reviewDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review Date *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review Content *</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={8}
                      placeholder="Write your detailed company review here..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-sm text-gray-500">Minimum 100 characters required</p>
                </FormItem>
              )}
            />

            <div>
              <Label htmlFor="reviewImage">Company Image</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors mt-2">
                <input
                  type="file"
                  id="reviewImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label htmlFor="reviewImage" className="cursor-pointer">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-w-xs mx-auto rounded-lg"
                      />
                      <p className="text-sm text-gray-600">Click to change image</p>
                    </div>
                  ) : (
                    <div>
                      <CloudUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-primary">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <FormField
              control={form.control}
              name="websiteUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Website *</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://company-website.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <Label>Overall Rating *</Label>
              <div className="flex items-center space-x-1 mt-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedRating(i + 1)}
                    className={`text-2xl transition-colors ${
                      i < selectedRating ? "text-yellow-400" : "text-gray-300"
                    } hover:text-yellow-400`}
                  >
                    <Star className="w-8 h-8 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={isLoading}>
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Saving..." : "Save Review"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
