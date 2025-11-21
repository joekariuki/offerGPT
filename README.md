<div align="center">

    <h1>offerGPT</h1>

    <p>

      Generate personalized real estate offers in seconds using AI

    </p>

</div>

## Tech Stack

- **Next.js 15** with App Router for modern web development

- **OpenAI** (GPT-4o & GPT-4-turbo) for AI-powered offer generation and editing

- **Clerk** for authentication

- **Drizzle ORM** and **Neon** (PostgreSQL) for database management

- **Shadcn UI** and **Radix UI** for beautiful, accessible components

- **Tailwind CSS** for styling

- **Vercel AI SDK** for streaming AI responses

## How it works

1. User creates a new offer with client name and address

2. The app generates a professional real estate offer using AI

3. Users can interact with an AI chat assistant to refine and update the offer

4. Offers can be edited, saved and managed through an intuitive interface

5. Offers can be exported as a PDF or copied as markdown text

6. Users can view all their offers in a centralized dashboard

## Cloning & running

1. Fork or clone the repo

2. Create accounts at [OpenAI](https://openai.com/) for AI capabilities

3. Set up Clerk for authentication ([Clerk.dev](https://clerk.dev/))

4. Create a Neon database ([Neon.tech](https://neon.tech/)) for PostgreSQL

5. Create a `.env` file (use `env.example` for reference) and add your API keys

6. Run `bun install` (or `npm install`) and `bun dev` (or `npm run dev`) to install dependencies and start the app locally

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
