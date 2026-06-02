"use client";

import { useEffect, useState } from "react";

export interface AssetCatalog {
  cad: string[];
  videos: string[];
  photos: string[];
}

const defaultCatalog: AssetCatalog = {
  cad: [],
  videos: [],
  photos: [],
};

let cachedCatalog: AssetCatalog | null = null;
const listeners = new Set<(cat: AssetCatalog) => void>();

function fetchCatalog() {
  if (cachedCatalog) return Promise.resolve(cachedCatalog);
  return fetch("/api/assets")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch assets");
      return res.json();
    })
    .then((data: AssetCatalog) => {
      cachedCatalog = data;
      listeners.forEach((l) => l(data));
      return data;
    })
    .catch((err) => {
      console.warn("Asset api not available or failed:", err);
      return defaultCatalog;
    });
}

export function useAssets() {
  const [catalog, setCatalog] = useState<AssetCatalog>(cachedCatalog || defaultCatalog);
  const [loading, setLoading] = useState(!cachedCatalog);

  useEffect(() => {
    const handleUpdate = (newCat: AssetCatalog) => {
      setCatalog(newCat);
      setLoading(false);
    };

    listeners.add(handleUpdate);

    if (!cachedCatalog) {
      fetchCatalog().then((data) => {
        setCatalog(data);
        setLoading(false);
      });
    }

    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  const getCadPath = (filename: string): string | null => {
    const cleanName = filename.toLowerCase();
    const found = catalog.cad.find((f) => f.toLowerCase() === cleanName);
    return found ? `/media/cad/${found}` : null;
  };

  const getVideoPath = (filename: string): string | null => {
    const cleanName = filename.toLowerCase();
    const found = catalog.videos.find((f) => f.toLowerCase() === cleanName);
    return found ? `/media/videos/${found}` : null;
  };

  const getPhotoPath = (filename: string): string | null => {
    const cleanName = filename.toLowerCase();
    const found = catalog.photos.find((f) => f.toLowerCase() === cleanName);
    return found ? `/media/photos/${found}` : null;
  };

  return {
    catalog,
    loading,
    getCadPath,
    getVideoPath,
    getPhotoPath,
    refresh: () => {
      cachedCatalog = null;
      fetchCatalog();
    },
  };
}
