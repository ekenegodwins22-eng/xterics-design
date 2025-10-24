import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";

export default function CustomOrder() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const createCustomOrderMutation = trpc.customOrders.create.useMutation();

  const [formData, setFormData] = useState({
    clientName: user?.name || "",
    clientEmail: user?.email || "",
    description: "",
    budget: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createCustomOrderMutation.mutateAsync({
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        description: formData.description,
        budget: formData.budget ? parseInt(formData.budget) * 100 : undefined,
      });

      setSuccess(true);
      setFormData({
        clientName: user?.name || "",
        clientEmail: user?.email || "",
        description: "",
        budget: "",
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error creating custom order:", error);
      alert("Failed to submit custom order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/")} className="text-slate-300">
            ← Back to Home
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-3xl">Custom Design Order</CardTitle>
              <CardDescription className="text-slate-400">
                Tell us about your unique project and we'll provide a custom quote
              </CardDescription>
            </CardHeader>
            <CardContent>
              {success ? (
                <div className="bg-green-900/20 border border-green-600 rounded-lg p-6 text-center">
                  <h3 className="text-xl font-bold text-green-400 mb-2">✓ Order Submitted Successfully!</h3>
                  <p className="text-slate-300 mb-4">
                    We've received your custom order request. Our team will review it and send you a quote within 24 hours.
                  </p>
                  <p className="text-slate-400 text-sm">
                    Check your email at <strong>{formData.clientEmail}</strong> for updates.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      name="clientName"
                      value={formData.clientName}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      required
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      name="clientEmail"
                      value={formData.clientEmail}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      required
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Project Description *
                    </label>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your project in detail. What do you need designed? Include your vision, target audience, style preferences, colors, inspiration, timeline, etc."
                      required
                      minLength={20}
                      rows={8}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      {formData.description.length} characters (minimum 20)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Budget (Optional)
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">$</span>
                      <Input
                        type="number"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        placeholder="Leave empty if unsure"
                        min="0"
                        step="10"
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      This helps us understand your budget range. We'll provide a quote based on your requirements.
                    </p>
                  </div>

                  <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-4">
                    <p className="text-sm text-blue-300">
                      <strong>How it works:</strong> Submit your custom order, and our team will review your requirements and send you a detailed quote within 24 hours.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || formData.description.length < 20}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Custom Order"}
                  </Button>

                  <p className="text-xs text-slate-400 text-center">
                    We'll contact you soon with a personalized quote
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

