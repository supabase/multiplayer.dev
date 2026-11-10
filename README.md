# multiplayer.dev

The open source demo app for [Supabase Realtime](https://supabase.com/docs/guides/realtime). Open [multiplayer.dev](https://multiplayer.dev) in a few browser tabs to see other visitors' cursors, who is online, and a shared chat, all delivered over Realtime.

## What this demo shows

- **Presence** – the avatar stack in the top corner shows who is currently online. Realtime tracks each connection and notifies everyone else when someone joins or leaves, even if they drop unexpectedly.
- **Broadcast** – cursor positions and emoji reactions are sent as short-lived Broadcast messages that fan out to everyone in the room without being stored in the database.
- **Broadcast from Database** – chat messages are inserted into a Postgres table, and a trigger calls `realtime.send` to broadcast each one to the room. See [`migrate.sql`](migrate.sql) and the [Broadcast from Database docs](https://supabase.com/docs/guides/realtime/broadcast#broadcast-from-the-database).
- **Broadcast Replay** – the chat channel is private and asks Realtime to replay recent messages, so you see recent history when you join or reconnect. Replayed messages are shown dimmed.
- **Authorization** – private channels are checked against Row Level Security policies on `realtime.messages`. See the [Realtime Authorization docs](https://supabase.com/docs/guides/realtime/authorization).

## Getting started

1. Create a Supabase project and run [`migrate.sql`](migrate.sql) in the SQL editor to set up the chat table, trigger, and policies.
2. Copy `.env.example` to `.env.local` and fill in your project URL and API key (find them in your project's API settings).
3. Install dependencies and start the dev server:

   ```bash
   npm install
   npm run dev
   ```

## Learn more

- [Supabase Realtime, with Multiplayer Features](https://supabase.com/blog/supabase-realtime-with-multiplayer-features) – the 2022 launch post for this demo, covering Presence and Broadcast
- [Realtime: Broadcast from Database](https://supabase.com/blog/realtime-broadcast-from-database) – send database changes to clients with Broadcast
- [Realtime: Broadcast Replay](https://supabase.com/blog/realtime-broadcast-replay) – let private channels retrieve earlier messages
- [Realtime Authorization docs](https://supabase.com/docs/guides/realtime/authorization) – secure channels with RLS policies
- [Realtime documentation](https://supabase.com/docs/guides/realtime)
- [Supabase UI Library Realtime components](https://supabase.com/library?category=Realtime) – drop-in components for building features like these: [Realtime Cursor](https://supabase.com/library/docs/nextjs/realtime-cursor), [Realtime Avatar Stack](https://supabase.com/library/docs/nextjs/realtime-avatar-stack), and [Realtime Chat](https://supabase.com/library/docs/nextjs/realtime-chat)
