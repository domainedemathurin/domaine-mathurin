/*
  # Suppression des comptes clients

  1. Actions
    - Suppression des données analytiques
    - Suppression des profils utilisateurs non-admin
    - Suppression des commandes associées
    - Nettoyage des données associées
*/

-- Supprimer d'abord les données analytiques qui référencent les utilisateurs
DELETE FROM analytics_pageviews
WHERE user_id IN (
  SELECT u.id
  FROM auth.users u
  LEFT JOIN user_profiles up ON u.id = up.id
  WHERE (up.is_professional IS NULL OR up.is_professional = false)
);

DELETE FROM analytics_product_views
WHERE user_id IN (
  SELECT u.id
  FROM auth.users u
  LEFT JOIN user_profiles up ON u.id = up.id
  WHERE (up.is_professional IS NULL OR up.is_professional = false)
);

-- Supprimer les commandes et articles de commande des utilisateurs non-admin
DELETE FROM order_items
WHERE order_id IN (
  SELECT o.id
  FROM orders o
  JOIN auth.users u ON o.user_id = u.id
  LEFT JOIN user_profiles up ON u.id = up.id
  WHERE (up.is_professional IS NULL OR up.is_professional = false)
);

DELETE FROM orders
WHERE user_id IN (
  SELECT u.id
  FROM auth.users u
  LEFT JOIN user_profiles up ON u.id = up.id
  WHERE (up.is_professional IS NULL OR up.is_professional = false)
);

-- Supprimer les profils utilisateurs non-admin
DELETE FROM user_profiles
WHERE (is_professional IS NULL OR is_professional = false);

-- Supprimer les utilisateurs non-admin de auth.users
DELETE FROM auth.users
WHERE id IN (
  SELECT u.id
  FROM auth.users u
  LEFT JOIN user_profiles up ON u.id = up.id
  WHERE (up.is_professional IS NULL OR up.is_professional = false)
);