/*
  # Configuration des commandes et intégration Stripe

  1. Nouvelles Tables
    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `status` (text)
      - `total` (numeric)
      - `stripe_payment_intent_id` (text)
      - `created_at` (timestamp)
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key)
      - `product_id` (integer, foreign key)
      - `quantity` (integer)
      - `price` (numeric)

  2. Sécurité
    - Enable RLS sur les tables
    - Politiques pour les utilisateurs authentifiés
    - Politiques pour les administrateurs
*/

-- Table des commandes
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  status text NOT NULL DEFAULT 'pending',
  total numeric(10,2) NOT NULL,
  stripe_payment_intent_id text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT status_check CHECK (status IN ('pending', 'processing', 'completed', 'cancelled'))
);

-- Table des articles de commande
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id integer NOT NULL REFERENCES products(id),
  quantity integer NOT NULL,
  price numeric(10,2) NOT NULL,
  CONSTRAINT order_items_quantity_check CHECK (quantity > 0)
);

-- Activer RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes si elles existent
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
  DROP POLICY IF EXISTS "Allow full access for admins" ON orders;
  DROP POLICY IF EXISTS "Users can view their own order items" ON order_items;
END $$;

-- Politiques pour les commandes
CREATE POLICY "Users can view their own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Allow full access for admins"
  ON orders
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_professional = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_professional = true
    )
  );

-- Politiques pour les articles de commande
CREATE POLICY "Users can view their own order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (
    order_id IN (
      SELECT id FROM orders WHERE user_id = auth.uid()
    )
  );