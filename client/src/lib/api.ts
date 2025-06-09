import { apiRequest } from "./queryClient";
import type { Review, InsertReview } from "@shared/schema";

export const reviewsApi = {
  getAll: (): Promise<Review[]> =>
    fetch("/api/reviews").then(res => res.json()),

  getById: (id: number): Promise<Review> =>
    fetch(`/api/reviews/${id}`).then(res => res.json()),

  create: async (data: InsertReview & { image?: File }): Promise<Review> => {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'image' && value instanceof File) {
        formData.append('image', value);
      } else if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    const response = await fetch("/api/reviews", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create review");
    }

    return response.json();
  },

  update: async (id: number, data: Partial<InsertReview> & { image?: File }): Promise<Review> => {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'image' && value instanceof File) {
        formData.append('image', value);
      } else if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    const response = await fetch(`/api/reviews/${id}`, {
      method: "PUT",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update review");
    }

    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await apiRequest("DELETE", `/api/reviews/${id}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete review");
    }
  },
};
