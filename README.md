# Buienradar Bot

Buienradar Bot is a Telegram bot that provides rain forecasts for locations in the Netherlands. It utilizes the Buienradar API to retrieve precipitation data and responds with an estimate of when the rain will stop based on the provided location.

## Development

To develop the Buienradar Bot locally, follow these steps:

1. Copy the `.dev.vars.example` file to `.dev.vars`:

   ```shell
   cp .dev.vars.example .dev.vars
   ```

2. Replace the placeholder token in the `.dev.vars` file with your actual Telegram bot token.

3. Install the project dependencies using pnpm 8:

   ```shell
   pnpm install
   ```

4. Start the development server:

   ```shell
   pnpm start
   ```

To change the webhook URL for the bot, make a request to the following URL:
```
https://api.telegram.org/bot{YOUR_BOT_TOKEN}/setWebhook?url={YOUR_WEBHOOK_URL}
```

## License

This project is licensed under the ISC License.
