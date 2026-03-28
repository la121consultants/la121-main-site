import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const getSessionId = (): string => {
  let sessionId = localStorage.getItem("la121_session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("la121_session_id", sessionId);
  }
  return sessionId;
};

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        await supabase.from("page_views").insert({
          page_path: location.pathname,
          page_title: document.title,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
          session_id: getSessionId(),
        });
      } catch (e) {
        // Silent fail — tracking should never break the app
      }
    };

    trackPageView();
  }, [location.pathname]);
};
