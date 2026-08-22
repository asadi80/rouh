//ClinicDataContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const ClinicDataContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL;

function mapSettingsToClinicInfo(row) {
  if (!row) return null;
  
  const waMatch = row.whatsapp_url?.match(/wa\.me\/(\d+)/);
  return {
    name: row.name,
    shortName: row.short_name,
    tagline: row.tagline,
    description: row.description,
    phone: row.phone,
    phoneDisplay: row.phone,
    whatsapp: waMatch ? waMatch[1] : row.phone?.replace(/\D/g, ""),
    email: row.email,
    address: row.address,
    googleMapsUrl: row.google_maps_url,
    googleMapsEmbedUrl: row.google_maps_embed_url,
  };
}

function mapSettingsToSocialLinks(row) {
  if (!row) return [];
  
  const candidates = [
    { id: "instagram", label: "انستغرام", url: row.instagram_url },
    { id: "whatsapp", label: "واتساب", url: row.whatsapp_url },
    { id: "twitter", label: "X (تويتر)", url: row.twitter_url },
    { id: "facebook", label: "فيسبوك", url: row.facebook_url },
    { id: "tiktok", label: "تيك توك", url: row.tiktok_url },
    { id: "snapchat", label: "سناب شات", url: row.snapchat_url },
  ];
  return candidates.filter((c) => c.url && c.url.trim() !== "");
}

async function fetchJson(path) {
  const url = `${API_URL}${path}`;
  console.log(`📡 Fetching: ${url}`);

  const res = await fetch(url);
  const text = await res.text();

  console.log(`📥 Response status for ${path}:`, res.status);

  if (!res.ok) {
    throw new Error(`فشل تحميل ${path} (${res.status}): ${text || "Empty response"}`);
  }

  if (!text.trim()) {
    throw new Error(`الـ API أعاد استجابة فارغة: ${path}`);
  }

  try {
    const parsed = JSON.parse(text);
    console.log(`✅ Successfully parsed JSON for ${path}:`, parsed);
    return parsed;
  } catch (err) {
    console.error(`❌ Invalid JSON from ${url}:`, text);
    throw new Error(`استجابة غير صالحة من ${path}: ${text.slice(0, 200)}`);
  }
}

async function fetchFromApi() {
  console.log("🚀 Starting to fetch all API data...");
  console.log(`🔗 API_URL: ${API_URL}`);

  // Fetch all routes - if any fails, throw error
  const [settings, hours, doctors, services, whyUs] = await Promise.all([
    fetchJson("/api/settings"),
    fetchJson("/api/working-hours"),
    fetchJson("/api/doctors"),
    fetchJson("/api/services"),
    fetchJson("/api/why-us"),
  ]);

  console.log("📊 Raw API Data Summary:");
  console.log("  • Settings:", settings);
  console.log("  • Working Hours:", hours);
  console.log("  • Doctors:", doctors);
  console.log("  • Services:", services);
  console.log("  • Why Us:", whyUs);

  // Process the data
  const clinicInfo = mapSettingsToClinicInfo(settings);
  const socialLinks = mapSettingsToSocialLinks(settings);
  
  const workingHours = Array.isArray(hours) 
    ? hours.map((h) => ({
        day: h.day_of_week || h.day || "",
        hours: h.hours_text || h.hours || "",
        isOpen: h.is_open !== undefined ? h.is_open : true,
      }))
    : [];

  const processedServices = Array.isArray(services)
    ? services.map((s) => ({ 
        icon: s.icon || "🏥", 
        title: s.title || "Service", 
        desc: s.description || s.desc || "",
      }))
    : [];

  const processedWhyUs = Array.isArray(whyUs)
    ? whyUs.map((w) => ({ 
        icon: w.icon || "⭐", 
        title: w.title || "Why Us", 
        desc: w.description || w.desc || "",
      }))
    : [];

  const result = {
    clinicInfo,
    socialLinks,
    workingHours,
    doctors: Array.isArray(doctors) ? doctors : [],
    services: processedServices,
    whyUs: processedWhyUs,
    stats: [], // يمكن إضافة إحصائيات من الـ API لاحقاً
  };

  console.log("✅ Final processed data:", result);
  console.log("📊 Data counts:");
  console.log("  • Clinic Info:", Object.keys(clinicInfo).length, "fields");
  console.log("  • Social Links:", socialLinks.length, "items");
  console.log("  • Working Hours:", workingHours.length, "items");
  console.log("  • Doctors:", doctors.length, "items");
  console.log("  • Services:", processedServices.length, "items");
  console.log("  • Why Us:", processedWhyUs.length, "items");

  return result;
}

export function ClinicDataProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

   
    async function load() {
      if (!API_URL) {
        const errorMsg = "❌ VITE_API_URL is not defined. Please create a .env file with your backend URL.";
        console.error(errorMsg);
      
        if (!cancelled) {
          setError(errorMsg);
          setLoading(false);
        }
        return;
      }

      try {
        const fresh = await fetchFromApi();
        if (!cancelled) {
          console.log("✅ Setting data in state:", fresh);
          setData(fresh);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        console.error("❌ Failed to load clinic data from server:", err);
        console.error("❌ Error details:", err.message);
        console.error("❌ Error stack:", err.stack);
        
        if (!cancelled) {
          setError(`❌ Failed to load data: ${err.message}`);
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      console.log("🧹 Cleaning up ClinicDataProvider");
      cancelled = true;
    };
  }, []);

  const contextValue = { 
    ...data, 
    loading, 
    error,
    debug: () => {
      console.log("🔍 Current Context Data:");
      console.log("  • loading:", loading);
      console.log("  • error:", error);
      console.log("  • data:", data);
      console.log("  • clinicInfo:", data?.clinicInfo);
      console.log("  • socialLinks:", data?.socialLinks);
      console.log("  • workingHours:", data?.workingHours);
      console.log("  • doctors:", data?.doctors);
      console.log("  • services:", data?.services);
      console.log("  • whyUs:", data?.whyUs);
      console.log("  • stats:", data?.stats);
      return { loading, error, data };
    }
  };

  return (
    <ClinicDataContext.Provider value={contextValue}>
      {children}
    </ClinicDataContext.Provider>
  );
}

export function useClinicData() {
  const ctx = useContext(ClinicDataContext);
  if (!ctx) throw new Error("useClinicData must be used within ClinicDataProvider");
  return ctx;
}