import { useEffect } from "react";

const calendlyUrl = "https://calendly.com/la121consultants/30min";

const CalendlyWidget = () => {
  useEffect(() => {
    const scriptId = "calendly-widget-script";

    if (document.getElementById(scriptId)) return;

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-primary/10 p-6 space-y-4">
      <div className="space-y-2 text-center md:text-left">
        <p className="text-primary font-semibold">Live availability</p>
        <h2 className="text-3xl font-bold text-secondary">Book a free strategy call</h2>
        <p className="text-muted-foreground">
          Choose a 30-minute slot that works best for you. Once booked, you’ll receive a calendar
          invite with meeting details.
        </p>
      </div>
      {/* Calendly inline widget begin */}
      <div
        className="calendly-inline-widget rounded-lg overflow-hidden"
        data-url={calendlyUrl}
        style={{ minWidth: "320px", height: "700px" }}
      ></div>
      {/* Calendly inline widget end */}
    </div>
  );
};

export default CalendlyWidget;
