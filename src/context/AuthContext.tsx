'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

export interface PerfilUsuario {
  id: string;
  nome_completo: string;
  email: string;
  role: 'direcao' | 'coordenador_curso' | 'autor';
  curso_id?: string | null;
  matricula?: string | null;
}

interface AuthContextType {
  user: User | null;
  perfil: PerfilUsuario | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  recarregarPerfil: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  perfil: null,
  isLoading: true,
  signOut: async () => {},
  recarregarPerfil: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  const carregarPerfil = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('perfis_usuarios')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setPerfil(data as PerfilUsuario);
      } else {
        setPerfil(null);
      }
    } catch (err) {
      console.error('Erro ao buscar perfil institucional:', err);
      setPerfil(null);
    }
  }, [supabase]);

  const recarregarPerfil = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      await carregarPerfil(session.user.id);
    } else {
      setUser(null);
      setPerfil(null);
    }
  }, [supabase, carregarPerfil]);

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          setUser(session.user);
          await carregarPerfil(session.user.id);
        }
      } catch (err) {
        console.error('Erro na inicialização de sessão:', err);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        if (session?.user) {
          setUser(session.user);
          await carregarPerfil(session.user.id);
        } else {
          setUser(null);
          setPerfil(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [supabase, carregarPerfil]);

  const signOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Erro ao chamar logout seguro:', err);
    }
    await supabase.auth.signOut();
    setUser(null);
    setPerfil(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        perfil,
        isLoading,
        signOut,
        recarregarPerfil,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
