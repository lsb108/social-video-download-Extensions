import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.post("/api/fetch-video", async (req, res) => {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    try {
      // This is a mock implementation. Real video downloading requires 
      // specialized tools like yt-dlp which aren't easily available here.
      // We'll simulate fetching metadata.
      
      // Basic validation
      if (!url.includes("facebook.com") && !url.includes("tiktok.com") && !url.includes("instagram.com") && !url.includes("youtube.com")) {
        // We'll still try to "fetch" it for the demo
      }

      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Return mock data for the demo
      res.json({
        title: "Social Media Video",
        thumbnail: "https://picsum.photos/seed/video/400/225",
        downloadUrl: url, // In a real app, this would be the direct video link
        platform: url.includes("facebook") ? "Facebook" : url.includes("tiktok") ? "TikTok" : "Social Media"
      });
    } catch (error) {
      console.error("Error fetching video:", error);
      res.status(500).json({ error: "Failed to fetch video information" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
