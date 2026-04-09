"use client";

import { useEffect } from "react";
import { onMessageListener, requestForToken } from "@/lib/firebase";
import { toast } from "sonner";

export default function NotificationHandler() {
  useEffect(() => {
    // Request permission and get token when user is logged in
    const setupNotifications = async () => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        await requestForToken();
      }
    };

    setupNotifications();

    // Listen for foreground messages
    const unsubscribe = onMessageListener((payload: any) => {
      console.log('Message received in foreground:', payload);
      
      const title = payload.notification?.title || payload.data?.title || 'New Notification';
      const body = payload.notification?.body || payload.data?.body || 'You have a new message';

      toast.info(title, {
        description: body,
        duration: 5000,
        action: {
          label: "View",
          onClick: () => {
            console.log("Notification clicked", payload);
            if (payload.data?.url) {
              window.open(payload.data.url, '_blank');
            }
          },
        },
      });
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  return null; // This component doesn't render anything visible
}
