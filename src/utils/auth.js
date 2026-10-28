import { useSyncExternalStore } from "react";
import { supabase } from "../lib/supabase.js";

// Customer sign-in. Fakt Google (Supabase) — email Google ne verify kelela asto.
const KEY = "authUser";

function load() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "null");
    return v && v.email ? v : null;
  } catch {
    return null;
  }
}

let user = load();
const listeners = new Set();
const subscribe = (l) => (listeners.add(l), () => listeners.delete(l));

function commit(next) {
  user = next;
  try {
    next ? localStorage.setItem(KEY, JSON.stringify(next)) : localStorage.removeItem(KEY);
  } catch { /* storage blocked */ }
  listeners.forEach((l) => l());
}

// Google (kinva Supabase) login zala ki aapoaap customer sign in hoto
if (supabase) {
  // junya (verify na kelelya) email sign-in che user sign out kara: Supabase session nasel tar user nahi
  supabase.auth.getSession().then(({ data }) => {
    if (!data.session && user) commit(null);
  });
  supabase.auth.onAuthStateChange((event, session) => {
    const u = session?.user;
    if (u?.email) {
      const name = u.user_metadata?.full_name || u.user_metadata?.name || u.email.split("@")[0];
      if (!user || user.email !== u.email || user.name !== name) {
        commit({ name, email: u.email, avatar: u.user_metadata?.avatar_url || "", signedInAt: Date.now() });
      }
    } else if (event === "SIGNED_OUT") {
      commit(null);
    }
  });
}

export function signOut() {
  commit(null);
  if (supabase) supabase.auth.signOut();
}

export async function signInWithGoogle() {
  if (!supabase) throw new Error("Supabase connect nahi. .env file tapasa.");
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin + "/login",
      queryParams: { prompt: "select_account" }, // customer la Google account nivadu dya
    },
  });
  if (error) throw new Error(error.message);
}

export const useAuth = () => useSyncExternalStore(subscribe, () => user);