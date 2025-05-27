import { useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { sendEnquiry } from "@/Jod/utils/resend";
import toast from "react-hot-toast";
import { Mail, Send } from "lucide-react";

export default function ContactUs() {
  const navigate = useNavigate();
  const user = useUser();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.email) {
      toast.error("No user email found");
      return;
    }

    setIsSubmitting(true);
    try {
      await sendEnquiry(user.email, message, "New Enquiry");
      toast.success("Email sent successfully");
      navigate('/');
      setMessage('');
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have a question or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Mail className="w-4 h-4" />
                  Your Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={user?.email || ''}
                    className="input input-bordered w-full pl-10 bg-gray-50 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                    disabled
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Your Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="textarea textarea-bordered w-full min-h-[200px] bg-gray-50 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Tell us what's on your mind..."
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full group relative overflow-hidden transition-all duration-300 hover:shadow-lg"
                disabled={isSubmitting || !message.trim()}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      Sending...
                      <span className="loading loading-spinner loading-sm"></span>
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>We typically respond within 24 hours</p>
        </div>
      </div>
    </div>
  )
}
