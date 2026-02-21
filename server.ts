import express from "express";
import { createServer as createViteServer } from "vite";
import { Telegraf } from "telegraf";
import { setupBot, BotContext } from "./src/bot";

const PORT = 3000;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8357254222:AAFtChNHEUGcnz92s6uxO9-BNuCcIZdp4Ow";

async function startServer() {
  const app = express();

  // --- Telegram Bot Setup (Long Polling for Dev) ---
  let bot: Telegraf<BotContext> | null = null;

  if (BOT_TOKEN) {
    console.log("Starting Telegram Bot...");
    bot = new Telegraf(BOT_TOKEN);
    
    // Apply shared logic
    setupBot(bot);

    // Launch Bot
    bot.launch(() => {
        console.log("Bot is running in Long Polling mode!");
    }).catch(err => {
        console.error("Failed to launch bot:", err);
    });

    // Enable graceful stop
    process.once('SIGINT', () => bot?.stop('SIGINT'));
    process.once('SIGTERM', () => bot?.stop('SIGTERM'));
  }

  // --- Express Server Setup ---
  
  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", bot: bot ? "active" : "inactive" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
