import { useState } from "react";
import { X, CheckCircle2 } from "lucide-react";

const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/bJeaEXfFzeV43QTf6Kdwc0N";

const benefits = [
  "Gain real-world digital marketing work experience from home.",
  "Receive training and ongoing support.",
  "Get a reference on completion to support your job search.",
  "You’ll need a laptop, internet access, and at least two hours per week.",
  "Join hundreds of students who have completed the programme and fast-track your route into work.",
];

const WorkExperienceProgrammeBanner = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative w-full bg-yellow-400 text-secondary border-b-4 border-yellow-500">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 text-secondary/70 hover:text-secondary transition-colors z-10"
        aria-label="Dismiss banner"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-10 text-center">
        <p className="text-xs sm:text-sm font-extrabold uppercase tracking-widest mb-2">
          Only £29.99/month
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight mb-4">
          Join Our Digital Marketing Work Experience Programme
        </h2>

        <ul className="text-left sm:text-center max-w-3xl mx-auto mb-6 space-y-2">
          {benefits.map((benefit, i) => (
            <li key={i} className="flex items-start sm:items-center gap-2 sm:justify-center">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 sm:mt-0" />
              <span className="font-medium">{benefit}</span>
            </li>
          ))}
        </ul>

        <a
          href={STRIPE_PAYMENT_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center bg-secondary hover:bg-secondary/90 text-white font-bold px-8 py-4 rounded-lg shadow-lg transition-colors text-base sm:text-lg"
        >
          Apply and Pay £29.99/month
        </a>

        <p className="text-sm font-semibold mt-6 max-w-2xl mx-auto">
          After paying, email your CV to{" "}
          <a href="mailto:admin@la121consultants.co.uk?subject=Join%20the%20Digital%20Marketing%20Work%20Experience%20Programme" className="underline">
            admin@la121consultants.co.uk
          </a>{" "}
          with the subject line <span className="italic">"Join the Digital Marketing Work Experience Programme"</span>,
          and let us know in your email that you've paid. Onboarding will be arranged once we've received both your payment and your CV.
        </p>
      </div>
    </div>
  );
};

export default WorkExperienceProgrammeBanner;
