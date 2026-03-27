"use client"

import { useState } from "react"
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  User, 
  MessageSquare,
  Building2,
  Globe
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Google Map component
function GoogleMap() {
  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border-2">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3908.796710714299!2d104.9194993748359!3d11.56239999063208!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310951a1d81d304d%3A0x5039e55b37f587d4!2sPhnom%20Penh%2C%20Cambodia!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={false}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Store Location Map"
      />
    </div>
  )
}

// Contact form component
function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real application, you would send this to your backend
      console.log("Form submitted:", formData)
      
      setSubmitStatus("success")
      setFormData({ name: "", email: "", subject: "", message: "" })
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <Card className="border">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-bold">Get In Touch</CardTitle>
        <CardDescription>
          We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              name="subject"
              placeholder="What is this about?"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="message"
                name="message"
                placeholder="Tell us more about your inquiry..."
                value={formData.message}
                onChange={handleChange}
                className="min-h-[120px] pl-10"
                required
              />
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </>
            )}
          </Button>
          
          {submitStatus === "success" && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">Thank you! Your message has been sent successfully. We'll get back to you soon.</p>
            </div>
          )}
          
          {submitStatus === "error" && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">Sorry, there was an error sending your message. Please try again later.</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

// Store information component
function StoreInfo() {
  const storeInfo = {
    name: "E-Commerce Store",
    address: "123 Shopping Street, Phnom Penh, Cambodia",
    phone: "+855 23 123 456",
    email: "info@ecommerce.com",
    website: "www.ecommerce.com",
    // hours: {
    //   monday: "9:00 AM - 8:00 PM",
    //   tuesday: "9:00 AM - 8:00 PM",
    //   wednesday: "9:00 AM - 8:00 PM",
    //   thursday: "9:00 AM - 8:00 PM",
    //   friday: "9:00 AM - 9:00 PM",
    //   saturday: "10:00 AM - 8:00 PM",
    //   sunday: "10:00 AM - 6:00 PM"
    // }
  }

  return (
    <Card className="border">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-bold">Store Information</CardTitle>
        <CardDescription>
          Visit us or get in touch through any of the channels below
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Store Name</h3>
            <p className="text-sm text-muted-foreground">{storeInfo.name}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg mt-1">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Address</h3>
            <p className="text-sm text-muted-foreground">{storeInfo.address}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Phone className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Phone</h3>
            <p className="text-sm text-muted-foreground">{storeInfo.phone}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Email</h3>
            <p className="text-sm text-muted-foreground">{storeInfo.email}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Globe className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Website</h3>
            <p className="text-sm text-muted-foreground">{storeInfo.website}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-r from-primary to-primary/90 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              We're here to help you with any questions or concerns. Reach out to us and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Contact Form */}
            <div className="lg:order-2">
              <ContactForm />
            </div>

            {/* Store Information */}
            <div className="lg:order-1 space-y-8">
              <StoreInfo />
              
              {/* Map Section */}
              <div>
                <h2 className="text-xl  font-bold mb-6 text-gray-900">Find Us</h2>
                <GoogleMap />
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}