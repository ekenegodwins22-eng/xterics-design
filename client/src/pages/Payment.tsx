import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useRoute, useLocation } from "wouter";
import { useState, useEffect } from "react";

export default function Payment() {
  const [, params] = useRoute("/payment/:id");
  const [, navigate] = useLocation();
  const orderId = parseInt(params?.id || "0");
  const searchParams = new URLSearchParams(window.location.search);
  const paymentMethod = searchParams.get("method") as "stripe" | "flutterwave" | "crypto" | null;

  const { data: order, isLoading } = trpc.orders.getById.useQuery({ id: orderId });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStripePayment = async () => {
    setIsProcessing(true);
    try {
      // TODO: Integrate Stripe
      // For now, show placeholder
      alert("Stripe payment integration coming soon!");
      setIsProcessing(false);
    } catch (error) {
      console.error("Stripe error:", error);
      setIsProcessing(false);
    }
  };

  const handleFlutterwavePayment = async () => {
    setIsProcessing(true);
    try {
      // TODO: Integrate Flutterwave
      // For now, show placeholder
      alert("Flutterwave payment integration coming soon!");
      setIsProcessing(false);
    } catch (error) {
      console.error("Flutterwave error:", error);
      setIsProcessing(false);
    }
  };

  const handleCryptoPayment = async () => {
    setIsProcessing(true);
    try {
      // TODO: Integrate Nowpayments.io
      // For now, show placeholder
      alert("Cryptocurrency payment integration coming soon!");
      setIsProcessing(false);
    } catch (error) {
      console.error("Crypto error:", error);
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading payment details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="py-12 text-center">
            <p className="text-slate-400 text-lg mb-4">Order not found</p>
            <Button onClick={() => navigate("/")} variant="default">
              Go Home
            </Button>
          </CardContent>
        </Card>
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
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800 border-slate-700 sticky top-4">
              <CardHeader>
                <CardTitle className="text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-slate-400 text-sm">Order ID</p>
                  <p className="text-white font-semibold">#{orderId}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Client Name</p>
                  <p className="text-white font-semibold">{order.clientName}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Email</p>
                  <p className="text-white font-semibold text-sm">{order.clientEmail}</p>
                </div>
                <div className="border-t border-slate-700 pt-4">
                  <p className="text-slate-400 text-sm mb-2">Amount</p>
                  <p className="text-3xl font-bold text-blue-400">
                    ${(order.price / 100).toFixed(2)}
                  </p>
                </div>
                <div className="bg-slate-700 rounded-lg p-3">
                  <p className="text-slate-300 text-sm">
                    <span className="font-semibold">Status:</span> {order.status}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Complete Payment</CardTitle>
                <CardDescription className="text-slate-400">
                  Choose your preferred payment method
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stripe Payment */}
                {paymentMethod === "stripe" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Pay with Stripe</h3>
                    <p className="text-slate-300">
                      Securely pay with your credit or debit card
                    </p>
                    <Button
                      onClick={handleStripePayment}
                      disabled={isProcessing}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {isProcessing ? "Processing..." : "Pay with Stripe"}
                    </Button>
                  </div>
                )}

                {/* Flutterwave Payment */}
                {paymentMethod === "flutterwave" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Pay with Flutterwave</h3>
                    <p className="text-slate-300">
                      Pay using cards, bank transfer, or mobile money
                    </p>
                    <Button
                      onClick={handleFlutterwavePayment}
                      disabled={isProcessing}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      {isProcessing ? "Processing..." : "Pay with Flutterwave"}
                    </Button>
                  </div>
                )}

                {/* Crypto Payment */}
                {paymentMethod === "crypto" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Pay with Cryptocurrency</h3>
                    <p className="text-slate-300">
                      Pay using Polygon or Solana USDT/USDC
                    </p>
                    <div className="bg-slate-700 rounded-lg p-4 space-y-2">
                      <p className="text-sm text-slate-400">Accepted Networks:</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-slate-600 text-white px-3 py-1 rounded text-sm">Polygon USDT</span>
                        <span className="bg-slate-600 text-white px-3 py-1 rounded text-sm">Polygon USDC</span>
                        <span className="bg-slate-600 text-white px-3 py-1 rounded text-sm">Solana USDT</span>
                        <span className="bg-slate-600 text-white px-3 py-1 rounded text-sm">Solana USDC</span>
                      </div>
                    </div>
                    <Button
                      onClick={handleCryptoPayment}
                      disabled={isProcessing}
                      className="w-full bg-orange-600 hover:bg-orange-700"
                    >
                      {isProcessing ? "Processing..." : "Pay with Crypto"}
                    </Button>
                  </div>
                )}

                {!paymentMethod && (
                  <div className="text-center py-8">
                    <p className="text-slate-400">Invalid payment method selected</p>
                    <Button onClick={() => window.history.back()} className="mt-4" variant="outline">
                      Go Back
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="bg-green-900/20 border-green-700 mt-6">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <span className="text-green-400 text-xl">🔒</span>
                  <div>
                    <p className="text-green-400 font-semibold">Secure Payment</p>
                    <p className="text-green-300 text-sm">
                      All payments are processed securely through trusted payment providers. Your financial information is never stored on our servers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
