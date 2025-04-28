/*
  # Réinitialisation des comptes administrateurs
  
  1. Actions
    - Suppression de tous les comptes administrateurs existants
    - Création d'un nouveau compte administrateur pour Mathieu
*/

-- Supprimer tous les comptes administrateurs existants
DELETE FROM user_profiles
WHERE is_professional = true;

DELETE FROM auth.users
WHERE email = 'colombia@gmail.com';

-- Créer le nouveau compte administrateur
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'mathieu',
  crypt('colombia', gen_salt('bf')),
  now(),
  now(),
  now()
);

-- Créer le profil administrateur associé
INSERT INTO user_profiles (
  id,
  is_professional,
  created_at,
  updated_at
)
SELECT 
  id,
  true,
  now(),
  now()
FROM auth.users
WHERE email = 'mathieu';