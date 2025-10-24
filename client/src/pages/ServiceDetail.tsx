import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useRoute, useLocation } from "wouter";
import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function ServiceDetail() {
  const [, params] = useRoute("/service/:id");
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const serviceId = parseInt(params?.id || "0");

  const { data: service, isLoading: serviceLoading } = trpc.services.getById.useQuery({ id: serviceId });
  const createOrderMutation = trpc.orders.create.useMutation();

  const [formData, setFormData] = useState({
    clientName: user?.name || "",
    clientEmail: user?.email || "",
    description: "",
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"stripe" | "flutterwave" | "crypto" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPaymentMethod) {
      alert("Please select a payment method");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createOrderMutation.mutateAsync({
        serviceId,
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        description: formData.description,
      });

      // Redirect to payment page based on selected method
      const orderId = (result as any).insertId || (result as any)[0];
      navigate(`/payment/${orderId}?method=${selectedPaymentMethod}`);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (serviceLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Service not found</div>
      </div>
    );
  }

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
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
          <Card className="bg-slate-800 border-slate-700 max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-white">Login Required</CardTitle>
              <CardDescription className="text-slate-400">
                You need to login to place an order
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300">
                Login with your Google account to place orders and track your projects.
              </p>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <a href={getLoginUrl()}>Login with Google</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Service Info */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">{service.name}</CardTitle>
                <CardDescription className="text-slate-400">{service.category}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {service.image && (
                  <img 
                    src={service.image} 
                    alt={service.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
                <p className="text-slate-300">{service.description}</p>
                
                {service.features && (
                  <div>
                    <h4 className="font-semibold text-white mb-2">Features:</h4>
                    <ul className="text-slate-300 text-sm space-y-1">
                      {JSON.parse(service.features || "[]").map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="text-blue-400">✓</span> {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="border-t border-slate-700 pt-4">
                  <p className="text-slate-400 text-sm mb-2">Price</p>
                  <p className="text-4xl font-bold text-blue-400">
                    ${(service.price / 100).toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Form */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Place Your Order</CardTitle>
                <CardDescription className="text-slate-400">
                  Fill in your details and describe what you need
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                      Design Description *
                    </label>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe what you want in detail. Include style preferences, colors, inspiration, target audience, etc."
                      required
                      minLength={10}
                      rows={6}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      {formData.description.length} characters
                    </p>
                  </div>

                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-300">Service Price:</span>
                      <span className="text-white font-semibold">${(service.price / 100).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-slate-600 pt-2 flex justify-between items-center">
                      <span className="text-white font-bold">Total:</span>
                      <span className="text-2xl font-bold text-blue-400">${(service.price / 100).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Payment Method Selection */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-3">
                      Select Payment Method *
                    </label>
                    <div className="space-y-3">
                      {/* Stripe */}
                      <label className="flex items-center p-4 border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-700/50 transition"
                        style={{
                          backgroundColor: selectedPaymentMethod === "stripe" ? "rgba(37, 99, 235, 0.1)" : "transparent",
                          borderColor: selectedPaymentMethod === "stripe" ? "#2563eb" : "undefined"
                        }}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="stripe"
                          checked={selectedPaymentMethod === "stripe"}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value as "stripe")}
                          className="mr-3"
                        />
                        <div>
                          <p className="text-white font-semibold">Stripe</p>
                          <p className="text-slate-400 text-sm">Credit/Debit Cards</p>
                        </div>
                      </label>

                      {/* Flutterwave */}
                      <label className="flex items-center p-4 border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-700/50 transition"
                        style={{
                          backgroundColor: selectedPaymentMethod === "flutterwave" ? "rgba(37, 99, 235, 0.1)" : "transparent",
                          borderColor: selectedPaymentMethod === "flutterwave" ? "#2563eb" : "undefined"
                        }}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="flutterwave"
                          checked={selectedPaymentMethod === "flutterwave"}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value as "flutterwave")}
                          className="mr-3"
                        />
                        <div>
                          <p className="text-white font-semibold">Flutterwave</p>
                          <p className="text-slate-400 text-sm">Cards, Bank Transfer, Mobile Money</p>
                        </div>
                      </label>

                      {/* Nowpayments (Crypto) */}
                      <label className="flex items-center p-4 border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-700/50 transition"
                        style={{
                          backgroundColor: selectedPaymentMethod === "crypto" ? "rgba(37, 99, 235, 0.1)" : "transparent",
                          borderColor: selectedPaymentMethod === "crypto" ? "#2563eb" : "undefined"
                        }}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="crypto"
                          checked={selectedPaymentMethod === "crypto"}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value as "crypto")}
                          className="mr-3"
                        />
                        <div>
                          <p className="text-white font-semibold">Cryptocurrency</p>
                          <p className="text-slate-400 text-sm">Polygon & Solana USDT/USDC</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || formData.description.length < 10 || !selectedPaymentMethod}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2"
                  >
                    {isSubmitting ? "Processing..." : "Proceed to Payment"}
                  </Button>

                  <p className="text-xs text-slate-400 text-center">
                    You will be redirected to our secure payment page
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

