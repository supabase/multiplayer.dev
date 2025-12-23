import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // Randomly pick between '1.0.0' and '2.0.0'
  const vsn = Math.random() < 0.5 ? '1.0.0' : '2.0.0';

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!,
    { realtime: { vsn: vsn, heartbeatIntervalMs: 2000 } }
  );
}
