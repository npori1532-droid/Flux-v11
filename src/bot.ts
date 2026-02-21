import { Telegraf, Markup, Context } from "telegraf";

// Define custom context if needed
export interface BotContext extends Context {
  // Add custom properties here if needed
}

// Environment Variables
const ADMIN_IDS = (process.env.ADMIN_IDS || "6973940391,7588253940").split(",").map((id) => id.trim());

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

export function setupBot(bot: Telegraf<BotContext>) {
  // Middleware to log messages
  bot.use(async (ctx, next) => {
    // console.log("Processing update", ctx.updateType);
    await next();
  });

  // Start Command
  bot.start((ctx) => {
    const firstName = ctx.from?.first_name || "User";
    const welcomeMessage = `
👋 *Welcome, ${firstName}!*

I am the **Flux 1.1 Pro Bot**, created by *${DEV_INFO.name}*.
I can generate high-quality images using the Flux 1.1 Pro engine.

⚠️ *Before we begin, please join our official channels to support us:*
`;
    
    const buttons = Markup.inlineKeyboard([
      [Markup.button.url("📢 Official Channel", DEV_INFO.officialChannel)],
      [Markup.button.url("🎮 FF Channel", DEV_INFO.ffChannel)],
      [Markup.button.url("🛡️ Backup Channel", DEV_INFO.backupChannel)],
      [Markup.button.url("💬 Chat Group", DEV_INFO.chatGroup)],
      [Markup.button.callback("✅ JOINED", "check_subscription")]
    ]);

    ctx.replyWithMarkdown(welcomeMessage, buttons);
  });

  // Check Subscription (Fake Check)
  bot.action("check_subscription", async (ctx) => {
    try {
      await ctx.answerCbQuery("✅ Verified! Welcome aboard.");
      await ctx.deleteMessage(); // Remove the join prompt
      showMainMenu(ctx);
    } catch (e) {
      console.error("Error in check_subscription:", e);
    }
  });

  // Main Menu Function
  const showMainMenu = (ctx: BotContext) => {
    const userId = ctx.from?.id.toString();
    const isAdmin = userId && ADMIN_IDS.includes(userId);

    let buttons = [
      [Markup.button.callback("🎨 Generate Image (Flux Ultra)", "gen_ultra")],
      [Markup.button.callback("🖼️ Generate Image (Flux Pro)", "gen_pro")],
      [Markup.button.callback("👨‍💻 Developer", "dev_info")],
    ];

    if (isAdmin) {
      buttons.push([Markup.button.callback("🔐 Admin Panel", "admin_panel")]);
    }

    ctx.replyWithMarkdown(
      `🤖 *Main Menu*

Select an option below to proceed.
Powered by *${DEV_INFO.name}*`,
      Markup.inlineKeyboard(buttons)
    );
  };

  // Developer Info
  bot.action("dev_info", (ctx) => {
    ctx.replyWithMarkdown(
      `👨‍💻 *Developer Information*

👤 **Name:** ${DEV_INFO.name}
📢 **Channel:** [Tech Master A2Z](${DEV_INFO.officialChannel})

_Creating professional bots for the community._`,
      Markup.inlineKeyboard([[Markup.button.callback("🔙 Back", "back_home")]])
    );
  });

  // Back to Home
  bot.action("back_home", (ctx) => {
    ctx.deleteMessage().catch(() => {});
    showMainMenu(ctx);
  });

  bot.action("gen_ultra", (ctx) => {
    ctx.reply("To generate an Ultra image, send:\n`/ultra Your Prompt Here`", { parse_mode: "Markdown" });
  });

  bot.action("gen_pro", (ctx) => {
    ctx.reply("To generate a Pro image, send:\n`/pro Your Prompt Here`", { parse_mode: "Markdown" });
  });

  // Handle /ultra command
  bot.command("ultra", async (ctx) => {
    const prompt = ctx.message.text.replace("/ultra", "").trim();
    if (!prompt) return ctx.reply("⚠️ Please provide a prompt. Example: `/ultra A futuristic city`", { parse_mode: "Markdown" });

    const loadingMsg = await ctx.reply("🎨 Generating Ultra image... Please wait.");

    try {
      const apiUrl = `${FLUX_API_ULTRA}?prompt=${encodeURIComponent(prompt)}`;
      
      await ctx.replyWithPhoto(apiUrl, {
        caption: `✨ *Generated with Flux 1.1 Pro Ultra*\nPrompt: \`${prompt}\`\n\nBy: ${DEV_INFO.name}`,
        parse_mode: "Markdown"
      });
      await ctx.telegram.deleteMessage(ctx.chat.id, loadingMsg.message_id).catch(() => {});
    } catch (error) {
      console.error("Error generating ultra image:", error);
      await ctx.telegram.editMessageText(ctx.chat.id, loadingMsg.message_id, undefined, "❌ Failed to generate image. The API might be busy or down.").catch(() => {});
    }
  });

  // Handle /pro command
  bot.command("pro", async (ctx) => {
    const prompt = ctx.message.text.replace("/pro", "").trim();
    if (!prompt) return ctx.reply("⚠️ Please provide a prompt. Example: `/pro A cute cat`", { parse_mode: "Markdown" });

    const loadingMsg = await ctx.reply("🎨 Generating Pro image... Please wait.");

    try {
      const apiUrl = `${FLUX_API_PRO}?prompt=${encodeURIComponent(prompt)}`;
      
      await ctx.replyWithPhoto(apiUrl, {
        caption: `✨ *Generated with Flux 1.1 Pro*\nPrompt: \`${prompt}\`\n\nBy: ${DEV_INFO.name}`,
        parse_mode: "Markdown"
      });
      await ctx.telegram.deleteMessage(ctx.chat.id, loadingMsg.message_id).catch(() => {});
    } catch (error) {
      console.error("Error generating pro image:", error);
      await ctx.telegram.editMessageText(ctx.chat.id, loadingMsg.message_id, undefined, "❌ Failed to generate image. The API might be busy or down.").catch(() => {});
    }
  });

  // Admin Panel
  bot.action("admin_panel", (ctx) => {
    const userId = ctx.from?.id.toString();
    if (!userId || !ADMIN_IDS.includes(userId)) {
      return ctx.answerCbQuery("⛔ Access Denied");
    }

    ctx.replyWithMarkdown(
      `🔐 *Admin Panel*

Welcome, Admin. Control your bot below.`,
      Markup.inlineKeyboard([
        [Markup.button.callback("📊 Stats", "admin_stats"), Markup.button.callback("📢 Broadcast", "admin_broadcast")],
        [Markup.button.callback("⚙️ Settings", "admin_settings")],
        [Markup.button.callback("🔙 Back", "back_home")]
      ])
    );
  });

  bot.action("admin_stats", (ctx) => {
      ctx.answerCbQuery("📊 Stats: Bot is running smoothly.");
      ctx.reply("📊 *Statistics*\n\nStatus: Online\nUptime: " + process.uptime().toFixed(0) + "s\nPlatform: Node.js/TypeScript", { parse_mode: "Markdown" });
  });

  bot.action("admin_broadcast", (ctx) => {
      ctx.answerCbQuery("📢 Broadcast feature coming soon.");
      ctx.reply("📢 To broadcast, this feature needs a database to store user IDs. (Not implemented in this demo)");
  });

  bot.action("admin_settings", (ctx) => {
      ctx.answerCbQuery("⚙️ Settings");
      ctx.reply("⚙️ *Bot Settings*\n\nMode: Production\nEngine: Flux 1.1 Pro", { parse_mode: "Markdown" });
  });
}
