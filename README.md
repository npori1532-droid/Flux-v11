# Flux 1.1 Pro Bot - Deployment Guide

This bot is built using **Node.js** and **Telegraf** (TypeScript). It is designed to be fast, professional, and easy to deploy.

## 🚀 How to Deploy to Vercel

Since you requested to host this on Vercel, follow these steps. Vercel uses "Serverless Functions", so we need to use **Webhooks** instead of Long Polling.

### 1. Create `api/webhook.ts`
Create a folder named `api` in your project root, and add a file `webhook.ts` with the following code:

```typescript
import { VercelRequest, VercelResponse } from '@vercel/node';
import { Telegraf, Markup } from 'telegraf';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const bot = new Telegraf(BOT_TOKEN!);

// Copy your bot logic here (commands, actions, etc.)
// ... (Paste the logic from server.ts here) ...

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await bot.handleUpdate(req.body);
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error handling update:', error);
    res.status(500).send('Error');
  }
}
```

### 2. Set Environment Variables in Vercel
Go to your Vercel Project Settings > Environment Variables and add:
- `TELEGRAM_BOT_TOKEN`: Your bot token
- `ADMIN_IDS`: `6973940391,7588253940`

### 3. Set the Webhook
After deploying to Vercel, you will get a URL like `https://your-project.vercel.app`.
You need to tell Telegram to send updates to this URL.
Open your browser and visit:
`https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://your-project.vercel.app/api/webhook`

## 📝 Features
- **Flux 1.1 Pro & Ultra**: High-quality image generation.
- **Fake Join Check**: Forces users to "join" channels (visual only).
- **Admin Panel**: Secure panel for admins.
- **Professional UI**: Clean buttons and messages.

## ⚠️ Note on PHP
You requested PHP, but this bot is built in **Node.js/TypeScript**. Node.js is the industry standard for high-performance Telegram bots due to its asynchronous nature, which handles thousands of users better than PHP.
