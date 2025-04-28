import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  setUser: (user: User | null) => void;
  login: (username: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAdmin: false,
      setUser: (user) => set({ 
        user,
        isAdmin: user?.email === 'domainedemathurin@gmail.com'
      }),
      login: async (username, password) => {
        try {
          // Connexion directe pour l'administrateur
          if (username === 'mathieu' && password === 'colombia') {
            const { data, error } = await supabase.auth.signInWithPassword({
              email: 'domainedemathurin@gmail.com',
              password: 'colombia'
            });

            if (error) {
              // Si l'utilisateur n'existe pas, le créer
              if (error.message.includes('Invalid login credentials')) {
                const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                  email: 'domainedemathurin@gmail.com',
                  password: 'colombia'
                });

                if (signUpError) throw signUpError;

                if (signUpData.user) {
                  set({ 
                    user: {
                      id: signUpData.user.id,
                      email: signUpData.user.email || ''
                    },
                    isAdmin: true
                  });

                  // Mettre à jour le profil utilisateur comme administrateur
                  await supabase
                    .from('user_profiles')
                    .upsert({
                      id: signUpData.user.id,
                      is_professional: true,
                      first_name: 'Mathieu',
                      last_name: 'Admin'
                    });

                  return true;
                }
              } else {
                throw error;
              }
            }

            if (data.user) {
              set({ 
                user: {
                  id: data.user.id,
                  email: data.user.email || ''
                },
                isAdmin: true
              });
              return true;
            }
          }
          
          return false;
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },
      signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        set({ user: null, isAdmin: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

// Initialiser l'état de l'utilisateur au chargement
supabase.auth.getSession().then(({ data: { session } }) => {
  if (session?.user) {
    useAuthStore.getState().setUser({
      id: session.user.id,
      email: session.user.email || '',
    });
  }
});

// Écouter les changements d'authentification
supabase.auth.onAuthStateChange((event, session) => {
  if (session?.user) {
    useAuthStore.getState().setUser({
      id: session.user.id,
      email: session.user.email || '',
    });
  } else {
    useAuthStore.getState().setUser(null);
  }
});