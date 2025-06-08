import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MapPin, Clock, Phone, Mail, CalendarIcon, MessageCircle, Gem, Sparkles, Compass } from "lucide-react";
import { format } from "date-fns";
import { insertContactSubmissionSchema } from "@shared/schema";
import { z } from "zod";

const contactFormSchema = insertContactSubmissionSchema.extend({
  preferredDate: z.date().optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      isConsultation: false,
    },
  });

  const isConsultation = form.watch("isConsultation");

  const handleSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      const submissionData = {
        ...data,
        preferredDate: selectedDate,
      };

      await apiRequest("POST", "/api/contact", submissionData);
      
      toast({
        title: "Message Sent Successfully!",
        description: isConsultation 
          ? "Thank you for booking a consultation. We'll contact you within 24 hours to confirm your appointment."
          : "Thank you for contacting us. We'll get back to you within 24 hours.",
      });

      form.reset();
      setSelectedDate(undefined);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const consultationTypes = [
    "Engagement Ring Consultation",
    "Custom Design Session",
    "Wedding Band Fitting",
    "Jewelry Appraisal",
    "Ring Resizing",
    "General Inquiry"
  ];

  const businessHours = [
    { day: "Monday - Friday", hours: "10:00 AM - 6:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 5:00 PM" },
    { day: "Sunday", hours: "By Appointment Only" },
  ];

  const services = [
    {
      icon: Gem,
      title: "Custom Design",
      description: "Create unique pieces tailored to your vision"
    },
    {
      icon: Heart,
      title: "Engagement Consultation",
      description: "Expert guidance for the perfect proposal"
    },
    {
      icon: Star,
      title: "Jewelry Services",
      description: "Cleaning, repairs, and maintenance"
    }
  ];

  return (
    <div className="min-h-screen bg-warm-cream">
      {/* Hero Section */}
      <section className="bg-navy text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Visit our downtown Winnipeg showroom or schedule a private consultation. 
              Our jewelry experts are here to help you find the perfect piece.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="luxury-shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-serif text-navy">
                  Contact Us
                </CardTitle>
                <p className="text-gray-600">
                  Send us a message or book a consultation with our jewelry experts.
                </p>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input placeholder="john@example.com" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="(204) 555-0123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Consultation Toggle */}
                    <FormField
                      control={form.control}
                      name="isConsultation"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="isConsultation"
                              checked={field.value}
                              onChange={field.onChange}
                              className="rounded border-gray-300"
                            />
                            <Label htmlFor="isConsultation" className="text-sm font-medium">
                              This is a consultation booking
                            </Label>
                          </div>
                        </FormItem>
                      )}
                    />

                    {/* Subject */}
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {isConsultation ? "Consultation Type" : "Subject"}
                          </FormLabel>
                          <FormControl>
                            {isConsultation ? (
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select consultation type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {consultationTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input placeholder="How can we help you?" {...field} />
                            )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Preferred Date for Consultations */}
                    {isConsultation && (
                      <div className="space-y-2">
                        <Label>Preferred Date (Optional)</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {selectedDate ? (
                                format(selectedDate, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}

                    {/* Message */}
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {isConsultation ? "Additional Details" : "Message"}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={
                                isConsultation
                                  ? "Tell us about your preferences, budget, or any specific requirements..."
                                  : "Please describe your inquiry in detail..."
                              }
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-navy hover:bg-rich-blue text-white h-12"
                    >
                      {isSubmitting
                        ? "Sending..."
                        : isConsultation
                        ? "Book Consultation"
                        : "Send Message"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Store Information */}
            <Card className="luxury-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-serif text-navy">
                  Visit Our Showroom
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-elegant-gold mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-navy">Downtown Winnipeg</h3>
                    <p className="text-gray-600">123 Main Street</p>
                    <p className="text-gray-600">Exchange District</p>
                    <p className="text-gray-600">Winnipeg, MB R3B 1A5</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-elegant-gold mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-navy">(204) 555-GEMS</h3>
                    <p className="text-gray-600">Speak with our jewelry experts</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-elegant-gold mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-navy">info@trovesandcoves.ca</h3>
                    <p className="text-gray-600">Email us anytime</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card className="luxury-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl font-serif text-navy">
                  <Clock className="h-5 w-5 text-elegant-gold" />
                  <span>Business Hours</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {businessHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="font-medium text-navy">{schedule.day}</span>
                      <span className="text-gray-600">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-elegant-gold/10 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Note:</strong> Private consultations available outside regular hours. 
                    Please contact us to schedule.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card className="luxury-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-serif text-navy">
                  Our Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {services.map((service, index) => {
                    const Icon = service.icon;
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <Icon className="h-5 w-5 text-elegant-gold mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-navy">{service.title}</h3>
                          <p className="text-sm text-gray-600">{service.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="bg-navy text-white luxury-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5 text-elegant-gold" />
                  <span>Need Immediate Assistance?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  For urgent jewelry needs or emergency repairs, call us directly during business hours.
                </p>
                <Button className="w-full bg-elegant-gold hover:bg-yellow-400 text-navy font-semibold">
                  Call (204) 555-GEMS
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
