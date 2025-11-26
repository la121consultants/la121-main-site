import { useEffect, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import { addDays, endOfDay, startOfDay } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { availabilityConfig } from "@/lib/availability/config";
import { detectUserTimeZone, formatSlot, generateSlots, Slot } from "@/lib/availability/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Calendar, Clock, Globe2, Phone } from "lucide-react";
import "react-day-picker/dist/style.css";

const services = [
  "CV Revamp",
  "Interview Prep",
  "Career Coaching",
  "Career Portfolio",
  "Other",
];

const durations = [10, 20, 30];

const BookCallForm = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [duration, setDuration] = useState<number>(20);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceInterest, setServiceInterest] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const userTimeZone = detectUserTimeZone();

  // Temporarily disabled until consultations table is created
  const existingBookings: { start_time: string; end_time: string }[] = [];

  const slots = useMemo(
    () =>
      selectedDate
        ? generateSlots(selectedDate, duration, existingBookings, availabilityConfig)
        : [],
    [selectedDate, duration, existingBookings]
  );

  useEffect(() => {
    if (selectedSlot && !slots.find((slot) => slot.iso === selectedSlot.iso)) {
      setSelectedSlot(null);
    }
  }, [slots, selectedSlot]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedSlot) {
      toast.error("Please select a time slot.");
      return;
    }
    if (!fullName || !email || !serviceInterest) {
      toast.error("Name, email, and service interest are required.");
      return;
    }

    setSubmitting(true);
    setConfirmation(null);

    try {
      const { data, error } = await supabase.functions.invoke("book-call", {
        body: {
          fullName,
          email,
          phone,
          serviceInterest,
          message,
          startTime: selectedSlot.start.toISOString(),
          durationMinutes: duration,
          timeZone: userTimeZone || availabilityConfig.timeZone,
        },
      });

      if (error) {
        throw new Error(error.message || "Booking failed");
      }

      setConfirmation(
        data?.zoomLink
          ? `Your booking is confirmed. We have emailed details along with your Zoom link.`
          : `Your booking is confirmed. We will send your meeting details shortly.`
      );
      setFullName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setServiceInterest("");
      setSelectedSlot(null);
    } catch (err: any) {
      toast.error("Unable to complete booking", {
        description: err.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="shadow-lg border-primary/10">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Phone className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Book a Consultation</CardTitle>
          </div>
          <CardDescription>
            Choose a date and time that works for you. All calls run on UK time, but we show your local time where possible.
          </CardDescription>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              <Clock className="h-4 w-4 mr-1" /> {duration}-minute slot
            </Badge>
            <Badge variant="secondary" className="bg-muted text-secondary">Weekdays: 09:00 - 18:00 UK</Badge>
            <Badge variant="secondary" className="bg-muted text-secondary">Zoom + Google Calendar invite</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label>Pick a date</Label>
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={(date) => setSelectedDate(date)}
                disabled={{ before: new Date(), after: addDays(new Date(), 30) }}
                styles={{
                  head_cell: { color: "#4b5563" },
                  nav_button: { color: "#111827" },
                }}
              />
              <div className="space-y-2">
                <Label htmlFor="duration">Consultation length</Label>
                <Select value={duration.toString()} onValueChange={(value) => setDuration(Number(value))}>
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Choose duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((option) => (
                      <SelectItem key={option} value={option.toString()}>
                        {option} minutes
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe2 className="h-4 w-4" />
                <span>Showing times in your timezone: {userTimeZone}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Available times</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[320px] overflow-y-auto pr-1">
                {slots.length === 0 && (
                  <div className="col-span-3 text-sm text-muted-foreground border rounded-md p-3 bg-muted/40">
                    No slots for this date. Try another day or adjust the duration.
                  </div>
                )}
                {slots.map((slot) => (
                  <button
                    key={slot.iso}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`border rounded-md px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      selectedSlot?.iso === slot.iso
                        ? "bg-primary text-white border-primary"
                        : "bg-white hover:border-primary/50"
                    }`}
                  >
                    {formatSlot(slot, userTimeZone)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-primary/10">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Share your details</CardTitle>
          </div>
          <CardDescription>We use this to tailor the session and send your invite.</CardDescription>
        </CardHeader>
        <CardContent>
          {confirmation && (
            <div className="mb-4 rounded-lg border border-green-300 bg-green-50 text-green-800 p-3 text-sm">
              {confirmation}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name *</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Taylor"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+44 20 1234 5678"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serviceInterest">Service interest *</Label>
                <Select value={serviceInterest} onValueChange={setServiceInterest}>
                  <SelectTrigger id="serviceInterest">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Tell us about your goals</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your career goals, target roles, or links we should review."
                rows={4}
              />
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Booking your slot..." : "Confirm booking"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookCallForm;
