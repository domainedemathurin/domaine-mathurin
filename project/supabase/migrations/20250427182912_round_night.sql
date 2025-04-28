/*
  # Reset admin accounts
  
  1. Actions
    - Delete existing admin accounts and related data
    - Create new admin account for Mathieu
    - Set up admin profile
*/

-- Désactiver temporairement les triggers
ALTER TABLE auth.users DISABLE TRIGGER ALL;
ALTER TABLE user_profiles DISABLE TRIGGER ALL;

-- Supprimer d'abord les données qui référencent les utilisateurs
TRUNCATE analytics_pageviews CASCADE;
TRUNCATE analytics_product_views CASCADE;
TRUNCATE order_items CASCADE;
TRUNCATE orders CASCADE;
TRUNCATE user_profiles CASCADE;
TRUNCATE auth.users CASCADE;

-- Créer le nouveau compte administrateur
WITH new_user AS (
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
  )
  RETURNING id
)
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
FROM new_user;

-- Réactiver les triggers
ALTER TABLE auth.users ENABLE TRIGGER ALL;
ALTER TABLE user_profiles ENABLE TRIGGER ALL;