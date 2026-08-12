import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "company" | "collector" | "citizen";
export const ADMIN_EMAIL = "barqaday@gmail.com";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string;
  phone: string | null;
  company_name: string | null;
  city: string | null;
  avatar_url: string | null;
  lat: number | null;
  lng: number | null;
}

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  roles: AppRole[];
  loading: boolean;
  isAdmin: boolean;
  isCompany: boolean;
  isCollector: boolean;
  isCitizen: boolean;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  const loadExtras = async (uid: string, email: string | null) => {
    const [{ data: p }, { data: r }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", uid).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", uid),
    ]);
    setProfile((p as Profile) ?? null);
    const list = (r ?? []).map((x: { role: AppRole }) => x.role);
    if (email?.toLowerCase() === ADMIN_EMAIL && !list.includes("admin")) list.push("admin");
    setRoles(list);
  };

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s?.user) {
        setTimeout(() => loadExtras(s.user.id, s.user.email ?? null), 0);
      } else {
        setProfile(null);
        setRoles([]);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) {
        loadExtras(data.session.user.id, data.session.user.email ?? null).finally(() =>
          setLoading(false),
        );
      } else setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const value: AuthState = {
    session,
    user: session?.user ?? null,
    profile,
    roles,
    loading,
    isAdmin: roles.includes("admin") || session?.user?.email?.toLowerCase() === ADMIN_EMAIL,
    isCompany: roles.includes("company"),
    isCollector: roles.includes("collector"),
    isCitizen: roles.includes("citizen"),
    signOut: async () => {
      await supabase.auth.signOut();
    },
    refresh: async () => {
      if (session?.user) await loadExtras(session.user.id, session.user.email ?? null);
    },
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth outside AuthProvider");
  return v;
}
