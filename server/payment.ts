import Stripe from "stripe";
import axios from "axios";

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

// ============ Stripe Payment ============
export async function createStripePaymentIntent(amount: number, orderId: number) {
  if (!stripe) {
    throw new Error("Stripe is not configured");
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: "usd",
      metadata: {
        orderId: orderId.toString(),
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.error("Stripe error:", error);
    throw error;
  }
}

export async function confirmStripePayment(paymentIntentId: string) {
  if (!stripe) {
    throw new Error("Stripe is not configured");
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent.status === "succeeded";
  } catch (error) {
    console.error("Stripe confirmation error:", error);
    throw error;
  }
}

// ============ Flutterwave Payment ============
export async function createFlutterwavePayment(
  amount: number,
  orderId: number,
  clientEmail: string,
  clientName: string,
  redirectUrl: string
) {
  if (!process.env.FLUTTERWAVE_SECRET_KEY) {
    throw new Error("Flutterwave is not configured");
  }

  try {
    const response = await axios.post(
      "https://api.flutterwave.com/v3/payments",
      {
        tx_ref: `order-${orderId}-${Date.now()}`,
        amount: amount,
        currency: "NGN", // Nigerian Naira
        redirect_url: redirectUrl,
        customer: {
          email: clientEmail,
          name: clientName,
        },
        customizations: {
          title: "Xterics Design Payment",
          description: `Payment for order #${orderId}`,
          logo: process.env.VITE_APP_LOGO || "",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.status === "success") {
      return {
        paymentLink: response.data.data.link,
        paymentId: response.data.data.id,
      };
    } else {
      throw new Error("Failed to create Flutterwave payment");
    }
  } catch (error) {
    console.error("Flutterwave error:", error);
    throw error;
  }
}

export async function verifyFlutterwavePayment(transactionId: string) {
  if (!process.env.FLUTTERWAVE_SECRET_KEY) {
    throw new Error("Flutterwave is not configured");
  }

  try {
    const response = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        },
      }
    );

    return response.data.data.status === "successful";
  } catch (error) {
    console.error("Flutterwave verification error:", error);
    throw error;
  }
}

// ============ Nowpayments Crypto Payment ============
export async function createNowpaymentsPayment(
  amount: number,
  orderId: number,
  clientEmail: string,
  redirectUrl: string,
  cryptoType: "polygon_usdt" | "polygon_usdc" | "solana_usdt" | "solana_usdc"
) {
  if (!process.env.NOWPAYMENTS_API_KEY) {
    throw new Error("Nowpayments is not configured");
  }

  // Map crypto types to Nowpayments currency codes
  const currencyMap: Record<string, string> = {
    polygon_usdt: "usdtp",
    polygon_usdc: "usdcp",
    solana_usdt: "usdts",
    solana_usdc: "usdcs",
  };

  try {
    const response = await axios.post(
      "https://api.nowpayments.io/v1/invoice",
      {
        price_amount: amount,
        price_currency: "usd",
        pay_currency: currencyMap[cryptoType],
        order_id: `order-${orderId}`,
        order_description: `Xterics Design Order #${orderId}`,
        ipn_callback_url: `${process.env.VITE_APP_URL || "http://localhost:3000"}/api/webhook/nowpayments`,
        success_url: redirectUrl,
        cancel_url: redirectUrl,
        partially_paid_url: redirectUrl,
      },
      {
        headers: {
          "x-api-key": process.env.NOWPAYMENTS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.invoice_url) {
      return {
        paymentLink: response.data.invoice_url,
        invoiceId: response.data.id,
      };
    } else {
      throw new Error("Failed to create Nowpayments invoice");
    }
  } catch (error) {
    console.error("Nowpayments error:", error);
    throw error;
  }
}

export async function verifyNowpaymentsPayment(invoiceId: string) {
  if (!process.env.NOWPAYMENTS_API_KEY) {
    throw new Error("Nowpayments is not configured");
  }

  try {
    const response = await axios.get(
      `https://api.nowpayments.io/v1/invoice/${invoiceId}`,
      {
        headers: {
          "x-api-key": process.env.NOWPAYMENTS_API_KEY,
        },
      }
    );

    return response.data.status === "finished";
  } catch (error) {
    console.error("Nowpayments verification error:", error);
    throw error;
  }
}
