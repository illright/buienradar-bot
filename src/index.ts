import { Bot, Composer, webhookCallback } from 'grammy/web';

export interface Env {
  BOT_TOKEN: string;
}

// Buienradar API endpoint
const BUIENRADAR_API_URL = 'https://gpsgadget.buienradar.nl/data/raintext';
export const buienradar = new Composer();

// Handler for /start command
buienradar.command('start', (ctx) => {
  return ctx.reply("Welcome to the Rain Forecast Bot! Please send me your location.");
});

// Handler for location messages
buienradar.on(':location', async (ctx) => {
  const lat = ctx.message?.location?.latitude;
  const lon = ctx.message?.location?.longitude;
  if (lat && lon) {
    const forecast = await getRainForecast(lat, lon);
    return ctx.reply(forecast);
  }
});

// Fetch rain forecast from Buienradar API
async function getRainForecast(lat: number, lon: number): Promise<string> {
  const url = `${BUIENRADAR_API_URL}?lat=${lat}&lon=${lon}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error fetching rain forecast');
    }
    const data = await response.text();

    // Parse the response data and find the first occurrence of three consecutive lines with 0 precipitation
    const forecastLines = data.split('\n');
    let consecutiveZeros = 0;
    let targetTime: string | null = null;
    for (const line of forecastLines) {
      if (line) {
        const [precipitation, timeStr] = line.split('|');
        if (precipitation === '0') {
          if (consecutiveZeros === 0) {
            targetTime = timeStr;
          }
          consecutiveZeros += 1;
          if (consecutiveZeros === 3) {
            break;
          }
        } else {
          consecutiveZeros = 0;
        }
      }
    }

    if (targetTime) {
      return `The rain will stop at ${targetTime}.`;
    } else {
      return 'No rain-free time found in the next 2 hours.';
    }
  } catch (error) {
    console.error('Error fetching rain forecast:', error);
    return 'Sorry, an error occurred while fetching the rain forecast.';
  }
}

export default {
  async fetch(
    request: Request,
    env: Env,
  ): Promise<Response> {
    const bot = new Bot(env.BOT_TOKEN);
    bot.use(buienradar);
    return webhookCallback(bot, "cloudflare-mod")(request);
  }
}
