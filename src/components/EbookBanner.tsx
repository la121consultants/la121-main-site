import { useState } from "react";
import { BookOpen, Download, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const EBOOK_DOWNLOAD_URL =
  "https://drive.google.com/file/d/1bdi2Iw6LJ4pi1v-gQZtQ0JwVoGws3V3m/view?usp=drive_link";

const EbookBanner = () => {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  if (dismissed) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("form_submissions").insert({
        form_type: "free_ebook_international",
        additional_notes: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          ebook: "Free International Students Career Guide",
        }),
        status: "new",
      });

      if (error) throw error;

      setSubmitted(true);
    } catch (err) {
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full bg-red-600 text-white">
      {/* Dismiss button */}
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors z-10"
        aria-label="Dismiss banner"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-10">
        {!showForm && !submitted && (
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="flex-shrink-0 bg-white/20 rounded-full p-4">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-red-200 mb-1">
                Free Resource for International Students
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold leading-tight mb-2">
                Download Your Free Career Guide — Exclusively for International Students
              </h2>
              <p className="text-red-100 text-sm sm:text-base max-w-2xl">
                Everything you need to land your first UK job: CV tips, interview strategies,
                visa-friendly employer lists, and more. Completely free.
              </p>
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 bg-white text-red-600 font-bold px-6 py-3 rounded-lg hover:bg-red-50 transition-colors shadow-lg text-sm sm:text-base whitespace-nowrap"
              >
                <Download className="w-4 h-4" />
                Get My Free Ebook
              </button>
            </div>
          </div>
        )}

        {showForm && !submitted && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-red-200 mb-1">
                Free Resource for International Students
              </p>
              <h2 className="text-xl sm:text-2xl font-bold">
                Enter your details to download the free ebook
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Full Name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white text-sm"
              />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white text-sm"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white text-sm"
              />
              <div className="flex gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border border-white/50 text-white font-semibold px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-sm"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-white text-red-600 font-bold px-4 py-3 rounded-lg hover:bg-red-50 transition-colors text-sm disabled:opacity-70"
                >
                  {loading ? "Submitting..." : "Submit & Download"}
                </button>
              </div>
            </form>
          </div>
        )}

        {submitted && (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">🎉</div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              Your free ebook is ready!
            </h2>
            <p className="text-red-100 mb-5 text-sm sm:text-base">
              Thank you, {form.name}! Click below to download your free career guide.
            </p>
            <a
              href={EBOOK_DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-red-600 font-bold px-8 py-3 rounded-lg hover:bg-red-50 transition-colors shadow-lg text-sm sm:text-base"
            >
              <Download className="w-5 h-5" />
              Download Free Ebook
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default EbookBanner;
