import { SupabaseClient } from '@supabase/supabase-js';

export type UserRole = 'client' | 'designer' | 'admin';

export async function getUserRole(supabase: SupabaseClient, userId: string): Promise<UserRole> {
  const { data } = await supabase.from('profiles').select('role').eq('id', userId).maybeSingle();
  const role = data?.role;
  return role === 'admin' || role === 'designer' ? role : 'client';
}

export async function requireStaff(supabase: SupabaseClient, userId: string) {
  const role = await getUserRole(supabase, userId);
  if (role !== 'admin' && role !== 'designer') throw new Error('FORBIDDEN');
  return role;
}
