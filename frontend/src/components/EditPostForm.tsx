import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { communityService } from "@/services/api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the form schema
const formSchema = z.object({
  title: z.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  content: z.string()
    .min(10, "Content must be at least 10 characters")
    .max(5000, "Content must be less than 5000 characters"),
  contentType: z.enum(["story", "blog", "photo", "event"], {
    required_error: "Please select a content type",
  }),
  location: z.string()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location must be less than 100 characters")
    .optional(),
  eventDate: z.string().optional(),
  images: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const EditPostForm = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      contentType: "story",
      location: "",
      eventDate: "",
      images: [],
    },
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setError(null);
        if (!postId) {
          throw new Error('Post ID is required');
        }
        const response = await communityService.getPost(postId);
        form.reset({
          title: response.title,
          content: response.content,
          contentType: response.contentType,
          location: response.location || "",
          eventDate: response.eventDate || "",
          images: response.images || [],
        });
      } catch (error: any) {
        console.error("Error fetching post:", error);
        setError(error.response?.data?.message || "Failed to load post. Please try again.");
        toast.error(error.response?.data?.message || "Failed to load post");
        navigate("/dashboard");
      }
    };

    fetchPost();
  }, [postId, navigate, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + newImages.length > 3) {
      toast.error("You can only upload up to 3 images");
      return;
    }

    setNewImages([...newImages, ...files]);
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    setNewImages(newImages.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setError(null);

    try {
      if (!postId) {
        throw new Error('Post ID is required');
      }

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append("contentType", data.contentType);
      if (data.location) formData.append("location", data.location);
      if (data.eventDate) formData.append("eventDate", data.eventDate);

      newImages.forEach((image) => {
        formData.append("images", image);
      });

      await communityService.updatePost(postId, formData);
      toast.success("Post updated successfully");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error updating post:", error);
      setError(error.response?.data?.message || "Failed to update post. Please try again.");
      toast.error(error.response?.data?.message || "Failed to update post");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
        <Button onClick={() => navigate("/dashboard")}>Return to Dashboard</Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter post title" {...field} />
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
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your post content here..."
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="story">Story</SelectItem>
                  <SelectItem value="blog">Blog</SelectItem>
                  <SelectItem value="photo">Photo</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("contentType") === "event" && (
          <FormField
            control={form.control}
            name="eventDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Images</FormLabel>
          <div className="grid grid-cols-3 gap-4">
            {form.watch("images")?.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    const currentImages = form.getValues("images") || [];
                    form.setValue(
                      "images",
                      currentImages.filter((_, i) => i !== index)
                    );
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                >
                  ×
                </button>
              </div>
            ))}
            {previewUrls.map((url, index) => (
              <div key={`preview-${index}`} className="relative">
                <img
                  src={url}
                  alt={`New preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                >
                  ×
                </button>
              </div>
            ))}
            {(form.watch("images")?.length || 0) + newImages.length < 3 && (
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                  multiple
                />
                <label
                  htmlFor="image-upload"
                  className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary"
                >
                  <span className="text-gray-500">Add Images</span>
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/dashboard")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Post"}
          </Button>
        </div>
      </form>
    </Form>
  );
}; 