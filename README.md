This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to your project settings and copy the Project URL and anon public key
3. Create a `.env.local` file in the root directory and add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Enable email authentication in your Supabase dashboard under Authentication > Providers
5. (Optional) Configure email templates and SMTP settings

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Deployment

### Vercel Deployment

This project is optimized for deployment on [Vercel](https://vercel.com).

1.  Connect your GitHub repository to Vercel.
2.  Set the following environment variables in your Vercel project settings:
    -   `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
    -   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous public key.
    -   `DATABASE_URL`: Your Supabase database connection string (if using direct DB access).
    -   `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (for server-side operations).
    -   `NEXTAUTH_SECRET`: A secret string for NextAuth.
    -   `NEXTAUTH_URL`: Your deployment URL (e.g., `https://your-app.vercel.app`).
3.  Vercel will automatically detect the Next.js framework and use the settings in `vercel.json`.

### GitHub Actions CI

A CI workflow has been set up in `.github/workflows/ci.yml`. It will automatically:
1.  Run `npm install`
2.  Run `npm run lint`
3.  Run `npm run build`

On every push and pull request to the `main` branch. To ensure the build step passes, you must add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as GitHub Secrets.

## Authentication Features

- Email + password sign in and registration
- Protected routes with middleware
- Automatic redirects for authenticated/unauthenticated users
- Arabic error messages and validation
- Loading states during authentication
- Logout functionality
- Form validation with real-time feedback

## Chat Features

- Live chat interface at `/student/chat`
- Arabic RTL support with premium dark SaaS design
- Chat bubbles with message status indicators
- File attachment support
- Typing indicators
- Real-time message simulation
- Connection status display

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
