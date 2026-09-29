# Ledger — Supabase CRUD web app

A complete **create / read / update / delete** React app. Records are stored in **Supabase Postgres**. There is no mock data and no localStorage as the database.

The domain is a **personal task manager**. Each signed-in user only sees their own rows (Row Level Security).

## 1. Project structure

```
supabase-crud-app/
├── .env.example
├── index.html
├── package.json
├── supabase/
│   └── schema.sql          # table, constraints, trigger, RLS, realtime
├── public/
│   └── favicon.svg
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── index.css
    ├── types/task.ts
    ├── lib/
    │   ├── supabase.ts     # client (anon key only)
    │   ├── auth.tsx        # session + sign in/up/out
    │   ├── tasks.ts        # CRUD + realtime subscribe
    │   └── utils.ts        # validation, formatting
    ├── hooks/useTasks.ts
    ├── components/
    │   ├── ProtectedRoute.tsx
    │   ├── layout/AppLayout.tsx
    │   ├── ui/             # Button, Input, Modal, Toast, Spinner, Badge
    │   └── tasks/          # Form, table, filters, delete modal
    └── pages/
        ├── DashboardPage.tsx
        ├── TasksPage.tsx
        ├── LoginPage.tsx
        ├── SignupPage.tsx
        └── NotFoundPage.tsx
```

## 2. Keys: what is safe in the frontend

| Key | Where it lives | Safe in the browser? |
|---|---|---|
| **Project URL** (`VITE_SUPABASE_URL`) | `.env` | Yes |
| **anon / public / publishable key** (`VITE_SUPABASE_ANON_KEY`) | `.env` | Yes — it is designed for clients. **RLS** is what protects rows. |
| **service_role key** | Supabase dashboard only | **No.** It bypasses RLS. Never put it in Vite env vars, git, or this repo. |

Vite only exposes variables that start with `VITE_`. That is intentional.

## 3. Connect the project to Supabase

1. Create a project at [https://supabase.com/dashboard](https://supabase.com/dashboard).
2. Open **SQL Editor**, paste `supabase/schema.sql`, and **Run**.
3. Open **Authentication → Providers** and keep **Email** enabled.
4. Optional for local testing: **Authentication → Providers → Email** → turn **off** “Confirm email” so you can sign in immediately.
5. Open **Project Settings → API**:
   - Copy **Project URL**
   - Copy the **anon public** key (sometimes labeled publishable)
6. In this folder:

```bash
copy .env.example .env
```

Then edit `.env`:

```
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

7. Confirm **Realtime** is on for `public.tasks` (the schema SQL adds the table to the `supabase_realtime` publication).

## 4. Environment variable example

See `.env.example`. After copying it, never commit `.env`.

## 5. Run locally

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

- Sign up, then sign in
- Open **Tasks**
- Add, search, filter, edit, and delete records

Production build:

```bash
npm run build
npm run preview
```

## 6. CRUD behavior

| Action | What happens |
|---|---|
| Create | Validated form → `insert` into `tasks` with `user_id = auth.uid()` → toast → list refresh |
| Read | `select *` on load, ordered by `created_at` desc; empty state if none |
| Update | Edit modal loads the row → `update` by `id` → toast → list refresh |
| Delete | Confirmation modal → `delete` by `id` → toast → list refresh |
| Realtime | A Postgres changes subscription refetches when another tab mutates your rows |

## 7. SQL schema and RLS

Full SQL is in `supabase/schema.sql`. Summary:

- `id uuid` primary key (`gen_random_uuid()`)
- `created_at` / `updated_at` timestamptz (`updated_at` via trigger)
- `title` required, length check
- `status` / `priority` constrained enums
- RLS enabled; authenticated users may only `select/insert/update/delete` rows where `user_id = auth.uid()`

Anonymous users cannot read or write tasks.

## 8. If something fails

- **Missing env vars**: copy `.env.example` and restart `npm run dev`.
- **relation "tasks" does not exist**: run `supabase/schema.sql`.
- **new row violates row-level security**: you are not signed in, or `user_id` is not the current user (the app always sends the session user).
- **Email not confirmed**: confirm the message from Supabase, or disable confirmations in Auth settings for development.
