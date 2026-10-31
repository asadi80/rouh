
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ClinicDataContext = createContext(null);

const API_URL = (
  import.meta.env.VITE_API_URL || "https://api.rouh.ly"
).replace(/\/$/, "");

// ======================================================
// DEFAULT DATA
// ======================================================

const EMPTY_CLINIC_INFO = {
  name: "عيادة روحي",
  shortName: "روحي",
  tagline: "",
  description: "",
  phone: "",
  phoneDisplay: "",
  whatsapp: "",
  email: "",
  address: "",
  googleMapsUrl: "",
  googleMapsEmbedUrl: "",
};

const EMPTY_DATA = {
  clinicInfo: EMPTY_CLINIC_INFO,
  socialLinks: [],
  workingHours: [],
  doctors: [],
  services: [],
  whyUs: [],
  stats: [],
};

// ======================================================
// CLINIC SETTINGS
// ======================================================

function mapSettingsToClinicInfo(row) {
  if (!row || typeof row !== "object") {
    return EMPTY_CLINIC_INFO;
  }

  const waMatch = row.whatsapp_url?.match(/wa\.me\/(\d+)/);

  return {
    name: row.name || EMPTY_CLINIC_INFO.name,
    shortName: row.short_name || EMPTY_CLINIC_INFO.shortName,
    tagline: row.tagline || "",
    description: row.description || "",
    phone: row.phone || "",
    phoneDisplay: row.phone || "",
    whatsapp: waMatch
      ? waMatch[1]
      : row.phone?.replace(/\D/g, "") || "",
    email: row.email || "",
    address: row.address || "",
    googleMapsUrl: row.google_maps_url || "",
    googleMapsEmbedUrl: row.google_maps_embed_url || "",
  };
}

// ======================================================
// SOCIAL LINKS
// ======================================================

function mapSettingsToSocialLinks(row) {
  if (!row || typeof row !== "object") return [];

  const candidates = [
    {
      id: "instagram",
      label: "انستغرام",
      url: row.instagram_url,
    },
    {
      id: "whatsapp",
      label: "واتساب",
      url: row.whatsapp_url,
    },
    {
      id: "twitter",
      label: "X (تويتر)",
      url: row.twitter_url,
    },
    {
      id: "facebook",
      label: "فيسبوك",
      url: row.facebook_url,
    },
    {
      id: "tiktok",
      label: "تيك توك",
      url: row.tiktok_url,
    },
    {
      id: "snapchat",
      label: "سناب شات",
      url: row.snapchat_url,
    },
  ];

  return candidates.filter(
    (item) =>
      typeof item.url === "string" &&
      item.url.trim() !== ""
  );
}

// ======================================================
// API REQUEST
// ======================================================

async function fetchJson(path) {
  const url = `${API_URL}${path}`;

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(
      `فشل تحميل ${path} (${response.status}): ${
        text || "Empty response"
      }`
    );
  }

  if (!text.trim()) {
    throw new Error(`استجابة فارغة من ${path}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    console.error("Invalid API JSON:", url, text);

    throw new Error(
      `استجابة غير صالحة من ${path}`
    );
  }
}

// ======================================================
// NORMALIZE API ARRAYS
// ======================================================

function normalizeArray(result, key) {
  if (Array.isArray(result)) return result;

  if (key && Array.isArray(result?.[key])) {
    return result[key];
  }

  if (Array.isArray(result?.data)) {
    return result.data;
  }

  return [];
}

// ======================================================
// FETCH ALL CLINIC DATA INDEPENDENTLY
// ======================================================

async function fetchFromApi() {
  const endpoints = [
    {
      key: "settings",
      path: "/api/settings",
    },
    {
      key: "hours",
      path: "/api/working-hours",
    },
    {
      key: "doctors",
      path: "/api/doctors",
    },
    {
      key: "services",
      path: "/api/services",
    },
    {
      key: "whyUs",
      path: "/api/why-us",
    },
  ];

  const responses = await Promise.allSettled(
    endpoints.map((endpoint) =>
      fetchJson(endpoint.path)
    )
  );

  const rawData = {};

  responses.forEach((response, index) => {
    const endpoint = endpoints[index];

    if (response.status === "fulfilled") {
      rawData[endpoint.key] = response.value;
    } else {
      rawData[endpoint.key] = null;

      console.error(
        `Failed to load ${endpoint.path}:`,
        response.reason
      );
    }
  });

  // Settings
  const settings = rawData.settings;

  const clinicInfo = mapSettingsToClinicInfo(settings);

  const socialLinks = mapSettingsToSocialLinks(settings);

  // Working hours
  const hours = normalizeArray(rawData.hours, "workingHours");

  const workingHours = hours.map((item) => ({
    day: item.day_of_week || item.day || "",
    hours: item.hours_text || item.hours || "",
    isOpen:
      item.is_open !== undefined
        ? item.is_open
        : true,
  }));

  // Doctors
  const doctors = normalizeArray(rawData.doctors, "doctors");

  // Services
  const services = normalizeArray(rawData.services, "services");

  const processedServices = services.map((item) => ({
    icon: item.icon || "🏥",
    title: item.title || "Service",
    desc: item.description || item.desc || "",
  }));

  // Why us
  const whyUs = normalizeArray(rawData.whyUs, "whyUs");

  const processedWhyUs = whyUs.map((item) => ({
    icon: item.icon || "⭐",
    title: item.title || "Why Us",
    desc: item.description || item.desc || "",
  }));

  const result = {
    clinicInfo,
    socialLinks,
    workingHours,
    doctors,
    services: processedServices,
    whyUs: processedWhyUs,
    stats: [],
  };

  console.log("Clinic data loaded:", {
    doctors: doctors.length,
    workingHours: workingHours.length,
    services: processedServices.length,
    whyUs: processedWhyUs.length,
    clinicInfo: Boolean(settings),
  });

  return result;
}

// ======================================================
// CLINIC DATA PROVIDER
// ======================================================

export function ClinicDataProvider({ children }) {
  const [data, setData] = useState(EMPTY_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        if (!API_URL) {
          throw new Error(
            "VITE_API_URL is not configured."
          );
        }

        const freshData = await fetchFromApi();

        if (!cancelled) {
          setData(freshData);
          setError(null);
        }
      } catch (err) {
        console.error(
          "Failed to load clinic data:",
          err
        );

        if (!cancelled) {
          setError(err.message);
          // Keep EMPTY_DATA so the application can still render.
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  // ====================================================
  // CONTEXT VALUE
  // ====================================================

  const contextValue = {
    ...EMPTY_DATA,
    ...data,

    clinicInfo: data?.clinicInfo || EMPTY_CLINIC_INFO,
    socialLinks: data?.socialLinks || [],
    workingHours: data?.workingHours || [],
    doctors: data?.doctors || [],
    services: data?.services || [],
    whyUs: data?.whyUs || [],
    stats: data?.stats || [],

    loading,
    error,

    debug: () => {
      const result = {
        loading,
        error,
        data,
      };

      console.log("Clinic Data Debug:", result);

      return result;
    },
  };

  return (
    <ClinicDataContext.Provider value={contextValue}>
      {children}
    </ClinicDataContext.Provider>
  );
}

// ======================================================
// CUSTOM HOOK
// ======================================================

export function useClinicData() {
  const context = useContext(ClinicDataContext);

  if (!context) {
    throw new Error(
      "useClinicData must be used within ClinicDataProvider"
    );
  }

  return context;
}
