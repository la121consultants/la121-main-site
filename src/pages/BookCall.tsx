import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CalendlyWidget from '@/components/CalendlyWidget';

const BookCall = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gradient-to-b from-slate-50 via-white to-slate-50">
        <section className="py-16 border-b bg-white/60 backdrop-blur">
          <div className="container px-4 mx-auto text-center max-w-3xl space-y-4">
            <p className="text-primary font-semibold">Book a free strategy call</p>
            <h1 className="text-4xl md:text-5xl font-bold text-secondary leading-tight">
              Plan your next career move with LA121 consultants
            </h1>
            <p className="text-lg text-muted-foreground">
              Pick a time that works for you, tell us what you need help with, and we’ll send a calendar invite with a Zoom link.
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
              <div className="px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold">UK time • Mon–Fri 09:00–18:00</div>
              <div className="px-4 py-2 rounded-full bg-muted">10–30 minute consultations</div>
              <div className="px-4 py-2 rounded-full bg-muted">Google Calendar + Zoom meeting</div>
            </div>
          </div>
        </section>
        <section className="py-16">
          <div className="container px-4 mx-auto">
            <CalendlyWidget />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BookCall;
