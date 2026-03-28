import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, Download, Home, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

interface VerifiedEbook {
  ebookTitle: string;
  fileUrl: string;
  customerEmail: string;
}

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [ebook, setEbook] = useState<VerifiedEbook | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setError("No payment session found. Please contact support if you believe this is an error.");
        setLoading(false);
        return;
      }

      try {
        const { data, error: fnError } = await supabase.functions.invoke("verify-ebook-payment", {
          body: { sessionId },
        });

        if (fnError) throw new Error(fnError.message);
        if (!data?.verified) throw new Error("Payment could not be verified");

        setEbook({
          ebookTitle: data.ebookTitle,
          fileUrl: data.fileUrl,
          customerEmail: data.customerEmail,
        });

        // Auto-trigger download if we have a file URL
        if (data.fileUrl) {
          const link = document.createElement("a");
          link.href = data.fileUrl;
          link.download = "";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } catch (err) {
        console.error("Payment verification failed:", err);
        setError("We couldn't verify your payment. Please contact support with your order ID.");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <AlertCircle className="w-20 h-20 text-destructive mx-auto" />
            <h1 className="text-3xl font-bold text-foreground">Something went wrong</h1>
            <p className="text-muted-foreground">{error}</p>
            {sessionId && (
              <p className="text-sm text-muted-foreground">Order ID: {sessionId}</p>
            )}
            <Button asChild>
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="flex justify-center">
            <CheckCircle className="w-20 h-20 text-green-500" />
          </div>

          <div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Payment Successful!
            </h1>
            <p className="text-lg text-muted-foreground">
              Thank you for your purchase. Your ebook is ready to download.
            </p>
            {sessionId && (
              <p className="text-sm text-muted-foreground mt-2">
                Order ID: {sessionId}
              </p>
            )}
          </div>

          {ebook && (
            <Card>
              <CardHeader>
                <CardTitle>Download Your Ebook</CardTitle>
                <CardDescription>
                  Click below to download your purchased ebook
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  asChild
                >
                  <a href={ebook.fileUrl} download>
                    <span>{ebook.ebookTitle}</span>
                    <Download className="w-4 h-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            A confirmation email has been sent to {ebook?.customerEmail || "your email address"} with download links.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
