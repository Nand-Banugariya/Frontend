import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon, Image as ImageIcon, MapPin, X } from 'lucide-react';

type ContentType = 'story' | 'blog' | 'photo' | 'event';

const CreatePostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState<ContentType>('story');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Handle file input change
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newFiles: File[] = [];
    const newPreviewUrls: string[] = [];

    // Convert FileList to array and limit to 3 images
    const maxImages = 3;
    const filesToAdd = Array.from(files).slice(0, maxImages - images.length);

    // Create object URLs for previews
    filesToAdd.forEach(file => {
      if (file.type.startsWith('image/')) {
        newFiles.push(file);
        newPreviewUrls.push(URL.createObjectURL(file));
      }
    });

    setImages([...images, ...newFiles]);
    setImagePreviewUrls([...imagePreviewUrls, ...newPreviewUrls]);
  };

  // Remove image
  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviewUrls[index]); // Clean up object URL
    setImages(images.filter((_, i) => i !== index));
    setImagePreviewUrls(imagePreviewUrls.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    // Validate form
    if (!title.trim()) {
      setError('Please enter a title');
      setSubmitting(false);
      return;
    }

    if (!content.trim()) {
      setError('Please enter some content');
      setSubmitting(false);
      return;
    }

    if (contentType === 'event' && !date) {
      setError('Please select a date for the event');
      setSubmitting(false);
      return;
    }

    try {
      // Normally, we would upload images to a server and get URLs back
      // For now, we'll just simulate a successful submission

      // Create form data (for a real implementation)
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('contentType', contentType);
      if (location) formData.append('location', location);
      if (date) formData.append('eventDate', date.toISOString());
      images.forEach(image => {
        formData.append('images', image);
      });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Reset form on success
      setTitle('');
      setContent('');
      setContentType('story');
      setLocation('');
      setDate(undefined);
      
      // Clean up image previews
      imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
      setImages([]);
      setImagePreviewUrls([]);
      
      setSuccess(true);
    } catch (err) {
      setError('Failed to submit post. Please try again.');
      console.error('Error submitting post:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-6">Share Cultural Content</h2>
      
      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 rounded-lg text-green-700 dark:text-green-400">
          Your post was submitted successfully! It will be reviewed before appearing on the community page.
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg text-red-700 dark:text-red-400">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Content Type Selection */}
          <div>
            <Label className="text-base font-medium mb-3 block">What are you sharing?</Label>
            <RadioGroup 
              defaultValue="story" 
              value={contentType}
              onValueChange={(value) => setContentType(value as ContentType)}
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="story" id="story" />
                <Label htmlFor="story">Story</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="blog" id="blog" />
                <Label htmlFor="blog">Blog</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="photo" id="photo" />
                <Label htmlFor="photo">Photo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="event" id="event" />
                <Label htmlFor="event">Event</Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-base font-medium mb-2 block">Title</Label>
            <Input 
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`Enter a title for your ${contentType}`}
              className="max-w-2xl"
            />
          </div>
          
          {/* Content */}
          <div>
            <Label htmlFor="content" className="text-base font-medium mb-2 block">Content</Label>
            <Textarea 
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Share your ${contentType} details...`}
              className="min-h-[150px] max-w-2xl"
            />
          </div>
          
          {/* Location */}
          <div>
            <Label htmlFor="location" className="text-base font-medium mb-2 block">Location (optional)</Label>
            <div className="relative max-w-md">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where did this take place?"
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Event Date (only for events) */}
          {contentType === 'event' && (
            <div>
              <Label className="text-base font-medium mb-2 block">Event Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
          
          {/* Image Upload */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              Add Images {images.length > 0 ? `(${images.length}/3)` : '(optional)'}
            </Label>
            
            {/* Image Previews */}
            {imagePreviewUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-4 max-w-xl">
                {imagePreviewUrls.map((url, index) => (
                  <div key={index} className="relative rounded-lg overflow-hidden">
                    <img 
                      src={url}
                      alt={`Preview ${index}`}
                      className="w-full h-24 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Upload Button */}
            {images.length < 3 && (
              <div className="flex items-center max-w-md">
                <Label 
                  htmlFor="image-upload"
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <ImageIcon size={18} />
                  <span>Upload Image</span>
                </Label>
                <Input 
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple={true}
                  onChange={handleImageChange}
                  className="hidden"
                />
                <p className="text-xs text-gray-500 ml-3">Max 3 images, 5MB each</p>
              </div>
            )}
          </div>
          
          {/* Submit Button */}
          <div className="pt-4">
            <Button 
              type="submit" 
              disabled={submitting}
              className="min-w-[120px]"
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePostForm; 