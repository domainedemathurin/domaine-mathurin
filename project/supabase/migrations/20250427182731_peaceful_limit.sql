/*
  # Reset admin accounts
  
  1. Actions
    - Delete existing admin accounts
    - Create new admin account for Mathieu
    - Ensure profile exists
*/

-- Supprimer d'abord les données qui référencent les utilisateurs
DELETE FROM analytics_pageviews
WHERE user_id IN (
  SELECT u.id
  FROM auth.users u
  LEFT JOIN user_profiles up ON u.id = up.id
  WHERE up.is_professional = true
);

DELETE FROM analytics_product_views
WHERE user_id IN (
  SELECT u.id
  FROM auth.users u
  LEFT JOIN user_profiles up ON u.id = up.id
  WHERE up.is_professional = true
);

-- Supprimer les commandes et articles de commande
DELETE FROM order_items
WHERE order_id IN (
  SELECT o.id
  FROM orders o
  JOIN auth.users u ON o.user_id = u.id
  LEFT JOIN user_profiles up ON u.id = up.id
  WHERE up.is_professional = true
);

DELETE FROM orders
WHERE user_id IN (
  SELECT u.id
  FROM auth.users u
  LEFT JOIN user_profiles up ON u.id = up.id
  WHERE up.is_professional = true
);

-- Supprimer les profils et utilisateurs existants
DELETE FROM user_profiles
WHERE is_professional = true;

DELETE FROM auth.users
WHERE email IN ('colombia@gmail.com', 'mathieu');

-- Créer le nouveau compte administrateur
DO $$
DECLARE
  new_user_id uuid;
BEGIN
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
  RETURNING id INTO new_user_id;

  -- Créer le profil administrateur associé
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