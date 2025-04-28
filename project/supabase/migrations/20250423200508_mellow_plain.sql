/*
  # Création des tables pour les commandes

  1. Nouvelles Tables
    - `orders`
      - `id` (uuid, clé primaire)
      - `user_id` (uuid, référence vers auth.users)
      - `status` (text, statut de la commande)
      - `total` (decimal, montant total)
      - `created_at` (timestamp)
    
    - `order_items`
      - `id` (uuid, clé primaire)
      - `order_id` (uuid, référence vers orders)
      - `product_id` (integer, référence vers products)
      - `quantity` (integer)
      - `price` (decimal)

  2. Sécurité
    - RLS activé sur les tables
    - Politiques pour permettre aux utilisateurs de voir uniquement leurs commandes
*/

DO $$ 
BEGIN
  -- Create orders table if it doesn't exist
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'orders') THEN
    CREATE TABLE orders (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES auth.users NOT NULL,
      status text NOT NULL DEFAULT 'pending',
      total decimal(10,2) NOT NULL,
      created_at timestamptz DEFAULT now()
    );

    ALTER TABLE orders ADD CONSTRAINT status_check 
      CHECK (status IN ('pending', 'processing', 'completed', 'cancelled'));
  END IF;

  -- Create order_items table if it doesn't exist
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'order_items') THEN
    CREATE TABLE order_items (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      order_id uuid NOT NULL,
      product_id integer NOT NULL,
      quantity integer NOT NULL CHECK (quantity > 0),
      price decimal(10,2) NOT NULL
    );

    ALTER TABLE order_items 
      ADD CONSTRAINT fk_order 
      FOREIGN KEY (order_id) 
      REFERENCES orders(id) 
      ON DELETE CASCADE;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can view their own order items" ON order_items;

-- Create new policies
CREATE POLICY "Users can view their own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (
    order_id IN (
      SELECT id FROM orders WHERE user_id = auth.uid()
    )
  );