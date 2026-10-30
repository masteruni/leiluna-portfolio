import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// Lets phones "add to home screen" with the right name, colours and icon.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.short,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#050506",
    theme_color: "#050506",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
