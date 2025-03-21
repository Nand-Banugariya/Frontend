import { useEffect } from "react";
import { ArrowRight, Globe, Users, Target, BookOpen, Award, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const AboutUs = () => {
  useEffect(() => {
    // Update page title
    document.title = "About Us | Bharat Heritage";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-saffron/10 to-primary/5 py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-2">
            Our Journey
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Preserving India&apos;s Cultural Heritage
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
            Bharat Heritage is dedicated to documenting, preserving, and celebrating the rich cultural tapestry of India. We connect people with traditions, art, music, and history that define our civilization.
          </p>
          <div className="flex justify-center gap-4">
            <Button className="gap-2" size="lg">
              Explore Heritage <ArrowRight size={16} />
            </Button>
            <Button variant="outline" size="lg">
              Join Our Community
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mission & Vision */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="inline-block p-3 rounded-full bg-primary/10 text-primary">
              <Globe size={24} />
            </div>
            <h2 className="text-3xl font-serif font-bold">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-300">
              To create a comprehensive digital repository of India's cultural heritage, making it accessible to people around the world. We aim to bridge the gap between generations by preserving traditional knowledge and making it relevant to contemporary audiences.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span>Documenting diverse cultural expressions across regions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span>Creating interactive experiences that bring heritage to life</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span>Building a community of heritage enthusiasts and experts</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-6">
            <div className="inline-block p-3 rounded-full bg-primary/10 text-primary">
              <Target size={24} />
            </div>
            <h2 className="text-3xl font-serif font-bold">Our Vision</h2>
            <p className="text-gray-600 dark:text-gray-300">
              A world where India's cultural heritage is celebrated globally, preserved for future generations, and continues to inspire creativity and innovation. We envision a platform that serves as a bridge between past wisdom and future possibilities.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span>Becoming the most comprehensive resource for Indian cultural heritage</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span>Fostering cross-cultural understanding and appreciation</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span>Empowering communities to preserve their unique traditions</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Future Goals */}
      <div className="bg-secondary/5 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block p-3 rounded-full bg-primary/10 text-primary mb-4">
              <Sparkles size={24} />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Future Goals</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We are continuously expanding our horizons and setting ambitious goals to enhance our platform and reach more people around the world.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-xl shadow-sm border">
              <div className="p-3 rounded-full bg-primary/10 text-primary inline-block mb-4">
                <Globe size={20} />
              </div>
              <h3 className="text-xl font-bold mb-3">Expanded Content</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We plan to document all 28 states and 8 union territories of India, covering their unique cultural expressions, festivals, arts, cuisine, and architectural marvels.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-xl shadow-sm border">
              <div className="p-3 rounded-full bg-primary/10 text-primary inline-block mb-4">
                <Users size={20} />
              </div>
              <h3 className="text-xl font-bold mb-3">Community Engagement</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Building a network of contributors, researchers, and cultural ambassadors who can enrich our platform with authentic local knowledge and perspectives.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-xl shadow-sm border">
              <div className="p-3 rounded-full bg-primary/10 text-primary inline-block mb-4">
                <BookOpen size={20} />
              </div>
              <h3 className="text-xl font-bold mb-3">Educational Initiatives</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Developing resources for educational institutions to incorporate cultural heritage studies in their curriculum, fostering appreciation from a young age.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-xl shadow-sm border">
              <div className="p-3 rounded-full bg-primary/10 text-primary inline-block mb-4">
                <Award size={20} />
              </div>
              <h3 className="text-xl font-bold mb-3">Heritage Recognition</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Creating programs to recognize and support individuals and communities working to preserve endangered cultural practices and traditions.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-xl shadow-sm border">
              <div className="p-3 rounded-full bg-primary/10 text-primary inline-block mb-4">
                <Sparkles size={20} />
              </div>
              <h3 className="text-xl font-bold mb-3">Immersive Experiences</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Implementing augmented reality and virtual tours to provide immersive experiences of heritage sites and cultural events from anywhere in the world.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-xl shadow-sm border">
              <div className="p-3 rounded-full bg-primary/10 text-primary inline-block mb-4">
                <Globe size={20} />
              </div>
              <h3 className="text-xl font-bold mb-3">Global Partnerships</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Collaborating with international organizations, museums, and cultural institutions to showcase Indian heritage on a global platform.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Join Us CTA */}
      <div className="py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-serif font-bold mb-6">Join Us in Preserving Our Heritage</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Whether you're a cultural enthusiast, researcher, artist, or simply interested in learning more about India's rich heritage, we invite you to be part of our journey.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg">Create an Account</Button>
            <Button variant="outline" size="lg">Become a Contributor</Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
