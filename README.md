# Campus Find — College Lost & Found

A Next.js App Router full-stack starter for a college lost-and-found portal. It uses JavaScript, Prisma, SQLite, and a custom spatial-inspired interface (soft depth, ambient gradients, floating glass cards, generous spacing).

## Requirements
- Node.js 20.9 or newer
- npm

## Run locally
1. Extract the ZIP and open the `campus-lost-found` folder in VS Code.
2. Open a terminal in that folder.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Initialize the SQLite database:

   ```bash
   npx prisma db push
   ```

5. Start the app:

   ```bash
   npm run dev
   ```

6. Visit http://localhost:3000

The `.env` file uses `DATABASE_URL="file:./dev.db"`. Prisma resolves this SQLite path relative to the `prisma` directory, so the database is created at `prisma/dev.db`.

## Included
- Responsive home page with a spatial-inspired visual style
- Lost / found report form
- SQLite persistence through Prisma
- Search and filters (client-side over the latest 60 open reports)
- Email contact link
- Mark a listing as returned
- Server-side input validation
- Empty/loading-database error states

## Important limitations before deployment
This is a college project MVP, not a production-ready public service.
- No authentication, college email verification, admin authorization, moderation, rate limiting, or abuse reporting is implemented.
- The demo contact email is visible in listings. Do not use real private contact information until you replace this with authenticated/protected contact handling.
- The "Returned" action is not protected by ownership checks. Anyone can mark any listing returned. Add authentication and authorization before deploying publicly.
- Image support accepts an image URL only; it does not upload files.
- SQLite is suitable for local development and demos. For a multi-user production deployment, use a hosted database such as PostgreSQL and configure `DATABASE_URL` for your provider.
- `mailto:` opens the visitor's configured email app; it does not send email from the server.
- No automatic AI matching or email notifications are included.

## Main structure

```text
campus-lost-found/
├── app/
│   ├── api/items/route.js
│   ├── api/items/[id]/claim/route.js
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components/HomeClient.js
├── lib/prisma.js
├── prisma/schema.prisma
├── .env
├── .env.example
├── .gitignore
├── jsconfig.json
├── package.json
└── README.md
```

## Suggested next phase
1. Add student sign-in and college-email verification.
2. Restrict edit/return actions to the report owner or a moderator.
3. Add admin moderation and report-abuse workflow.
4. Move to PostgreSQL for deployment.
5. Add real image uploads through a storage provider and private messaging.
