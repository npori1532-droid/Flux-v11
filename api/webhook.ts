import { Telegraf, Markup, Context } from 'telegraf';
import axios from 'axios';

// Define custom context if needed
interface BotContext extends Context {
  // Add custom properties here if needed
}

// Hardcoded Configuration
const BOT_TOKEN = "8357254222:AAFtChNHEUGcnz92s6uxO9-BNuCcIZdp4Ow";
const ADMIN_IDS = ["6973940391", "7588253940"];

// API Endpoints
const FLUX_API_ULTRA = "https://dev.oculux.xyz/api/flux-1.1-pro-ultra";
const FLUX_API_PRO = "https://dev.oculux.xyz/api/flux-1.1-pro";

// Developer Info
const DEV_INFO = {
  name: "Tech Master",
  officialChannel: "https://t.me/tech_master_a2z",
  ffChannel: "https://t.me/we_are_protect_Bangladesh1",
  backupChannel: "https://t.me/gajarbotolzteam",
  chatGroup: "https://t.me/tech_chatx",
};

// Initialize Bot
const bot = new Telegraf<BotContext>(BOT_TOKEN);

// --- Helper Functions ---

// Main Menu Keyboard (Persistent)
const getMainMenu = () => {
  return Markup.keyboard([
    ['🎨 Generate Image', '👤 Account'],
    ['📢 Channels', '👨‍💻 Developer'],
    ['📞 Support', '🔐 Admin Panel']
  ]).resize();
};

// Generation Mode Keyboard
const getGenModeMenu = () => {
  return Markup.keyboard([
    ['✨ Flux 1.1 Ultra', '⚡ Flux 1.1 Pro'],
    ['🔙 Main Menu']
  ]).resize();
};

// --- Bot Logic ---

bot.start((ctx) => {
  const firstName = ctx.from?.first_name || "User";
  const welcomeMessage = `
👋 *Hello, ${firstName}!*

Welcome to the **Ultimate Flux 1.1 AI Bot**. 
I can generate hyper-realistic images using the latest Flux engines.

🚀 *Get Started:*
Use the menu buttons below to navigate.

⚠️ *Stay Updated:*
Please join our channels for the latest updates and free prompts!
`;
  
  // Inline buttons for links (Force Join style)
  const linkButtons = Markup.inlineKeyboard([
    [Markup.button.url("📢 Official Channel", DEV_INFO.officialChannel)],
    [Markup.button.url("💬 Join Chat Group", DEV_INFO.chatGroup)],
    [Markup.button.callback("✅ I Have Joined", "check_subscription")]
  ]);

  ctx.replyWithMarkdown(welcomeMessage, linkButtons).catch(e => console.error("Failed to reply:", e));
});

// Handle "I Have Joined"
bot.action("check_subscription", async (ctx) => {
  try {
    await ctx.answerCbQuery("✅ Welcome to the family!");
    await ctx.deleteMessage().catch(() => {});
    await ctx.reply("🎉 *Verification Successful!*", { parse_mode: "Markdown" });
    await ctx.reply("Select an option from the menu below 👇", getMainMenu());
  } catch (e) {
    console.error("Error in check_subscription:", e);
  }
});

// --- Menu Handlers ---

bot.hears('🔙 Main Menu', (ctx) => {
  ctx.reply("🏠 Returned to Main Menu", getMainMenu());
});

bot.hears('🎨 Generate Image', (ctx) => {
  ctx.reply("🎨 *Select Generation Engine:*\n\n✨ **Flux Ultra**: Best for realism & details.\n⚡ **Flux Pro**: Faster generation.", {
    parse_mode: "Markdown",
    ...getGenModeMenu()
  });
});

bot.hears('📢 Channels', (ctx) => {
  const buttons = Markup.inlineKeyboard([
    [Markup.button.url("📢 Official Channel", DEV_INFO.officialChannel)],
    [Markup.button.url("🎮 FF Channel", DEV_INFO.ffChannel)],
    [Markup.button.url("🛡️ Backup Channel", DEV_INFO.backupChannel)],
  ]);
  ctx.reply("📢 *Our Official Channels*", { parse_mode: "Markdown", ...buttons });
});

bot.hears('👨‍💻 Developer', (ctx) => {
  ctx.replyWithMarkdown(
    `👨‍💻 *Developer Profile*

👤 **Name:** ${DEV_INFO.name}
🛠 **Skills:** AI, Bot Development, Full Stack
📢 **Channel:** [Tech Master A2Z](${DEV_INFO.officialChannel})

_\"Innovation is our passion.\"_`,
    Markup.inlineKeyboard([[Markup.button.url("Contact Developer", DEV_INFO.officialChannel)]])
  );
});

bot.hears('👤 Account', (ctx) => {
  const userId = ctx.from.id;
  const name = ctx.from.first_name;
  ctx.replyWithMarkdown(`
👤 *User Profile*

🆔 **ID:** \`${userId}\`
Mw **Name:** ${name}
💎 **Plan:** Free Tier
  `);
});

bot.hears('📞 Support', (ctx) => {
  ctx.reply(`💬 Need help? Join our support group: ${DEV_INFO.chatGroup}`);
});

// --- Image Generation Logic ---

bot.hears('✨ Flux 1.1 Ultra', (ctx) => {
  ctx.reply("✨ *Flux Ultra Mode Selected*\n\nSend your prompt starting with `/ultra`\nExample: `/ultra A cyberpunk cat in neon city`", { parse_mode: "Markdown" });
});

bot.hears('⚡ Flux 1.1 Pro', (ctx) => {
  ctx.reply("⚡ *Flux Pro Mode Selected*\n\nSend your prompt starting with `/pro`\nExample: `/pro A cute robot holding a flower`", { parse_mode: "Markdown" });
});

// Helper to generate image
async function generateImage(ctx: any, prompt: string, apiUrl: string, engineName: string) {
  if (!prompt) return ctx.reply(`⚠️ Please provide a prompt.`, { parse_mode: "Markdown" });

  const loadingMsg = await ctx.reply(`🎨 *Generating with ${engineName}...*\n⏳ Please wait, this may take a few seconds...`, { parse_mode: "Markdown" });

  try {
    const fullUrl = `${apiUrl}?prompt=${encodeURIComponent(prompt)}`;
    
    // Fetch image as buffer to ensure it exists and is valid
    const response = await axios.get(fullUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data, 'binary');

    await ctx.replyWithPhoto({ source: imageBuffer }, {
      caption: `✨ *Generated with ${engineName}*\n📝 *Prompt:* \`${prompt}\`\n\n👤 *By:* ${DEV_INFO.name}`,
      parse_mode: "Markdown"
    });
    
    await ctx.telegram.deleteMessage(ctx.chat.id, loadingMsg.message_id).catch(() => {});
  } catch (error) {
    console.error(`Error generating ${engineName} image:`, error);
    await ctx.telegram.editMessageText(
      ctx.chat.id, 
      loadingMsg.message_id, 
      undefined, 
      `❌ *Generation Failed*\n\nThe API might be busy or the prompt was rejected.\nPlease try again later.`
    ).catch(() => {});
  }
}

bot.command("ultra", async (ctx) => {
  const prompt = ctx.message.text.replace("/ultra", "").trim();
  await generateImage(ctx, prompt, FLUX_API_ULTRA, "Flux 1.1 Ultra");
});

bot.command("pro", async (ctx) => {
  const prompt = ctx.message.text.replace("/pro", "").trim();
  await generateImage(ctx, prompt, FLUX_API_PRO, "Flux 1.1 Pro");
});

// --- Admin Panel ---

bot.hears('🔐 Admin Panel', (ctx) => {
  const userId = ctx.from?.id.toString();
  if (!userId || !ADMIN_IDS.includes(userId)) {
    return ctx.reply("⛔ *Access Denied*\nThis area is for admins only.", { parse_mode: "Markdown" });
  }

  ctx.replyWithMarkdown(
    `🔐 *Admin Control Panel*

Welcome back, Admin.`,
    Markup.inlineKeyboard([
      [Markup.button.callback("📊 View Stats", "admin_stats")],
      [Markup.button.callback("📢 Broadcast Message", "admin_broadcast")]
    ])
  );
});

bot.action("admin_stats", (ctx) => {
    ctx.answerCbQuery();
    ctx.reply("📊 *System Stats*\n\n🟢 Status: Online\n⚡ Platform: Vercel Serverless\n📅 Uptime: Always On", { parse_mode: "Markdown" });
});

bot.action("admin_broadcast", (ctx) => {
    ctx.answerCbQuery();
    ctx.reply("📢 Broadcast feature requires a database connection (not configured in this demo).");
});

// --- Vercel Handler ---

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!body) return res.status(400).json({ error: 'No body provided' });

      await bot.handleUpdate(body);
      res.status(200).json({ status: 'ok' });
    } else {
      res.status(200).json({ status: 'ready', message: 'Bot is running.' });
    }
  } catch (error: any) {
    console.error('Error handling update:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
