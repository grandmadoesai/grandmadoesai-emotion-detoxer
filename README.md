# Supabase + Next.js Initial Setup

## 1. Install packages
Run this inside your Next.js project:

```bash
npm install @supabase/supabase-js @supabase/ssr
```

## 2. Add the files
Copy the files below into your project, preserving the folder structure:

- `.env.local` — your Supabase URL and publishable key
- `utils/supabase/server.ts` — Supabase client for Server Components
- `utils/supabase/client.ts` — Supabase client for Client Components
- `utils/supabase/middleware.ts` — session-refresh helper used by middleware
- `middleware.ts` — root Next.js middleware that calls the helper above
- `app/page.tsx` — example page reading from a `todos` table

> `middleware.ts` at the project root wasn't in your original snippet but is
> required for `utils/supabase/middleware.ts` to actually run — without it,
> sessions won't be refreshed on requests. If you don't need auth session
> refreshing yet, you can safely delete it and the middleware helper file.

## 3. Point `.env.local` at your project
Already filled in with the values you provided:

```
NEXT_PUBLIC_SUPABASE_URL=https://sanrpitbrkxfrhjfruyr.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_1zdidjSz2LyMe2sx2jcExg_qVH3uvP3
```

Make sure `.env.local` is in your `.gitignore` (Next.js adds this by
default) so it never gets committed.

## 4. (Optional) Install Agent Skills
Gives AI coding tools ready-made Supabase instructions/scripts:

```bash
npx skills add supabase/agent-skills
```

## 5. Try it out
The example `app/page.tsx` expects a `todos` table with `id` and `name`
columns. Create one in the Supabase SQL editor, e.g.:

```sql
create table todos (
  id bigint generated always as identity primary key,
  name text not null
);
```

Then run your dev server:

```bash
npm run dev
```
