<div align="center">

# 🚀 React 19 + Shadcn/ui + Supabase Kit

**A modern, type-safe starter kit for building full-stack applications**

*React 19 • React Compiler • Shadcn/ui • Supabase • TypeScript*

---

</div>

## ⚡ Quick Start

### 1️⃣ First Time Setup

```bash
pnpm run init
```

This command will:
- ✅ Install all dependencies
- ✅ Login to Supabase (opens browser)
- ✅ Link to your remote Supabase project

> 💡 You'll need the **Project Reference ID** from your [Supabase Dashboard](https://supabase.com/dashboard) → Settings → General

### 2️⃣ Generate TypeScript Types

```bash
pnpm run be:types
```

This creates `src/types/supabase.d.ts` with all your database types.

> 🔄 Run this command **every time** you change your database schema to keep types in sync!

### 3️⃣ Start Development

**Backend (Supabase):**
```bash
pnpm run be:start
```
- 🌐 API: `http://localhost:54321`
- 🎨 Studio: `http://localhost:54323`
- 🗄️ Database: `postgresql://postgres:postgres@localhost:54322/postgres`

**Frontend (React):**
```bash
pnpm run fe:start
```
- 💻 Dev Server: `http://localhost:5173`

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 19, TypeScript, Vite |
| **UI** | Shadcn/ui, Tailwind CSS 4 |
| **Backend** | Supabase (Auth, Database, Storage) |
| **Type Safety** | Auto-generated types from DB schema |
| **Code Quality** | Biome (linter + formatter) |

---

## 📂 Project Structure

Feature-based architecture for better scalability and maintainability.

```
src/
├── features/              # 🎯 Feature modules (self-contained)
│   ├── todos/
│   │   ├── todos-service.ts    # API calls to Supabase
│   │   ├── todo-list.tsx       # Components
│   │   └── todos-page.tsx
│   ├── auth/
│   └── dashboard/
├── components/            # 🧩 Shared UI components
│   ├── ui/                   # Shadcn/ui components
│   └── layout/               # Sidebar, topbar, etc.
├── lib/                   # 🔧 Utilities & hooks
│   ├── hooks/                # useAuth, useMobile, etc.
│   ├── auth.ts
│   └── supabase.ts           # Supabase client
└── types/                 # 📝 TypeScript definitions
    ├── supabase.d.ts         # Auto-generated (DON'T EDIT!)
    └── todos.d.ts            # Feature-specific types

supabase/
├── migrations/            # 🗄️ Database migrations (auto-generated)
└── seed/                  # Sample data
```

---

## 🗄️ Working with the Database

All database operations are done through **Supabase Studio** - a visual interface that makes it easy to create tables, modify schemas, and manage data.

### 📥 Pull Changes from Remote

When someone on your team makes changes to the remote database:

```bash
pnpm run be:pull    # Download schema from remote
pnpm run be:types   # Regenerate TypeScript types
```

### ➕ Create a New Table

**Example:** Creating a `posts` table

<table>
<tr>
<td width="50">1️⃣</td>
<td>

**Start Supabase & Open Studio**
```bash
pnpm run be:start
```
Open `http://localhost:54323` in your browser

</td>
</tr>
<tr>
<td>2️⃣</td>
<td>

**Create Table in Studio**
- Go to **Table Editor** → **New Table**
- Name: `posts`
- Add columns:
  - `id` (uuid, primary key, auto-generate)
  - `title` (text, required)
  - `content` (text, optional)
  - `user_id` (uuid, foreign key to `auth.users`)
  - `created_at` (timestamptz, default now)
- Enable **Row Level Security (RLS)**
- Add RLS policies for user access

</td>
</tr>
<tr>
<td>3️⃣</td>
<td>

**Generate Migration File**
```bash
pnpm run be:diff -- add_posts_table
```
Creates a migration file in `supabase/migrations/` with all your changes.

</td>
</tr>
<tr>
<td>4️⃣</td>
<td>

**Generate TypeScript Types**
```bash
pnpm run be:types
```

</td>
</tr>
<tr>
<td>5️⃣</td>
<td>

**Create Feature Types** in `src/types/posts.d.ts`:
```typescript
import type { Database } from "./supabase";

export type Post = Database["public"]["Tables"]["posts"]["Row"];
export type CreatePostInput = Omit<
  Database["public"]["Tables"]["posts"]["Insert"],
  "user_id" | "id" | "created_at"
>;
export type UpdatePostInput = Database["public"]["Tables"]["posts"]["Update"];
```

</td>
</tr>
</table>

### ✏️ Modify an Existing Table

**Example:** Adding a `published` column to `posts`

1. **Open Studio** → Select `posts` table → **Add Column**
   - Name: `published`
   - Type: `boolean`
   - Default: `false`

2. **Generate Migration**
   ```bash
   pnpm run be:diff -- add_published_to_posts
   ```

3. **Regenerate Types**
   ```bash
   pnpm run be:types
   ```

### 📤 Push Changes to Production

After testing your changes locally:

```bash
pnpm run be:push
```

> ⚠️ **Warning**: This applies migrations to your **production** database. Always test locally first!

### 🔄 Reset Local Database

```bash
pnpm run be:reset
```

Deletes all local data and reapplies all migrations from scratch. Useful for testing migrations.

---

## 🔷 Type-Safe Database Access

All TypeScript types are **automatically generated** from your database schema.

### Benefits

- ✅ **Zero manual work** - Types stay in sync with your database
- ✅ **Catch errors early** - TypeScript catches mismatches at compile time
- ✅ **Full autocomplete** - IntelliSense knows all tables and columns
- ✅ **Refactoring safety** - Rename a column? TypeScript finds all usages

### How It Works

```
src/types/
├── supabase.d.ts     # Auto-generated by `pnpm run be:types` (DON'T EDIT!)
└── todos.d.ts        # Feature-specific types you create
```

**Example: `src/types/todos.d.ts`**
```typescript
import type { Database } from "./supabase";

export type Todo = Database["public"]["Tables"]["todos"]["Row"];
export type CreateTodoInput = Omit<
  Database["public"]["Tables"]["todos"]["Insert"],
  "user_id" | "id" | "created_at"
>;
export type UpdateTodoInput = Database["public"]["Tables"]["todos"]["Update"];
```

### Usage Example

```typescript
// src/features/todos/todos-service.ts
import { supabase } from "@/lib/supabase";
import type { CreateTodoInput, Todo } from "@/types/todos";

export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("todos")
    .insert({
      title: input.title,           // ✅ Full autocomplete!
      description: input.description,
      completed: input.completed,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

---

## 🏗️ Architecture

### Feature-Based Structure

Each feature is self-contained with its own components, service layer, and types.

```
src/features/todos/
├── todos-service.ts      # API calls to Supabase
├── todo-list.tsx         # Todo list component
├── todos-page.tsx        # Main page component
└── index.ts              # Exports
```

**Benefits:**
- 📁 Better code organization
- 🔍 Easier to find and maintain code
- ♻️ Reusable generic components in `/components`
- 🚀 Scalable as your app grows

### Service Layer Pattern

Each feature has a service file that handles all data operations:

```typescript
// todos-service.ts
import { supabase } from "@/lib/supabase";
import type { CreateTodoInput, Todo } from "@/types/todos";

export async function getTodos(): Promise<Todo[]> {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}
```

This pattern provides:
- 🎯 **Separation of concerns** - UI logic separate from data logic
- 🔄 **Reusability** - Same service used across multiple components
- 🧪 **Testability** - Easy to mock and test
- 📝 **Type safety** - Full TypeScript support with generated types

---

## 📋 Common Workflows

### 🆕 Starting a New Project

```bash
pnpm run init         # Setup and link to Supabase
pnpm run be:pull      # Pull remote database schema
pnpm run be:types     # Generate TypeScript types
pnpm run be:start     # Start local Supabase (in one terminal)
pnpm run fe:start     # Start frontend (in another terminal)
```

### ➕ Adding a New Table

```bash
pnpm run be:start                           # Start Supabase
# Open Studio at http://localhost:54323 and create your table
pnpm run be:diff -- add_your_table_name    # Generate migration
pnpm run be:types                           # Generate types
# Create src/types/your-feature.d.ts
pnpm run be:push                            # Push to production when ready
```

### 🔄 Syncing Remote Changes

```bash
pnpm run be:pull      # Pull changes from remote
pnpm run be:reset     # Apply changes locally
pnpm run be:types     # Regenerate types
```

---

## 📟 All Available Commands

### Main Commands

| Command | Description |
|---------|-------------|
| `pnpm install` | Install all dependencies |
| `pnpm run init` | First-time setup (install + login + link) |
| `pnpm run check` | Format and lint code with Biome |

### Backend (Supabase) Commands

| Command | Description |
|---------|-------------|
| `pnpm run be:start` | Start local Supabase services |
| `pnpm run be:stop` | Stop local Supabase services |
| `pnpm run be:status` | Show Supabase local status |
| `pnpm run be:pull` | Pull schema from remote database |
| `pnpm run be:push` | Push migrations to remote database ⚠️ |
| `pnpm run be:diff -- <name>` | Create migration from Studio changes |
| `pnpm run be:reset` | Reset local database (deletes all data) ⚠️ |
| `pnpm run be:types` | Generate TypeScript types from database |

### Frontend Commands

| Command | Description |
|---------|-------------|
| `pnpm run fe:start` | Start Vite dev server |
| `pnpm run fe:build` | Build for production |

---

## ✨ Features

- ✅ Complete authentication (login, signup, logout)
- ✅ User dashboard with profile management
- ✅ Todo management with full CRUD operations
- ✅ Feature-based architecture
- ✅ Row Level Security (RLS)
- ✅ Local Supabase for development
- ✅ Migration system with remote sync
- ✅ TypeScript types generated from database
- ✅ Ready-to-use UI components (Shadcn/ui)
- ✅ Theme provider (light/dark mode)
- ✅ Responsive design

---

## 🔐 Environment Variables

The project uses the following environment variables (already configured for local development):

```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=<auto-generated-key>
```

For production, create a `.env.production` file with your remote project credentials.

---

## 📚 Documentation

- [Supabase Docs](https://supabase.com/docs)
- [Shadcn/ui Docs](https://ui.shadcn.com)
- [React 19 Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)

---

## 📄 License

MIT
