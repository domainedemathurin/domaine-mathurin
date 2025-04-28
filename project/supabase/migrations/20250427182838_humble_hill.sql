/*
  # Reset admin accounts
  
  1. Actions
    - Delete existing admin accounts and related data
    - Create new admin account for Mathieu
    - Set up admin profile
*/

-- Supprimer d'abord les données qui référencent les utilisateurs
DELETE FROM analytics_pageviews;
DELETE FROM analytics_product_views;

-- Supprimer les commandes et articles de commande
DELETE FROM order_items;
DELETE FROM orders;

-- Supprimer tous les profils et utilisateurs
DELETE FROM user_profiles;
DELETE FROM auth.users;

-- Créer le nouveau compte administrateur
DO $$
DECLARE
  new_user_id uuid := gen_random_uuid();
BEGIN
  -- Insérer le nouvel utilisateur
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
    new_user_id,
    'authenticated',
    'authenticated',
    'mathieu',
    crypt('colombia', gen_salt('bf')),
    now(),
    now(),
    now()
  );

  -- Créer le profil administrateur
  INSERT INTO user_profiles (
    id,
    is_professional,
    created_at,
    updated_at
  )
  VALUES (
    new_user_id,
    true,
    now(),
    now()
  );
END $$;