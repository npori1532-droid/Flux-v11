import { Telegraf } from 'telegraf';
import { setupBot } from '../src/bot';

// Vercel Serverless Function Handler
export default async function handler(req: any, res: any) {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

  if (!BOT_TOKEN) {
    return res.status(500).json({ error: 'Bot token not configured' });
  }

  const bot = new Telegraf(BOT_TOKEN);
  setupBot(bot);

  try {
    // Handle the update from Telegram
    // Vercel passes the request body automatically
    if (req.method === 'POST') {
      await bot.handleUpdate(req.body);
      res.status(200).json({ status: 'ok' });
    } else {
      res.status(200).json({ status: 'ready', message: 'Send a POST request with Telegram update to this endpoint.' });
    }
  } catch (error) {
    console.error('Error handling update:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
