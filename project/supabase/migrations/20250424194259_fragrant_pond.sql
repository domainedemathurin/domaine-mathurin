/*
  # Add products table and policies

  1. New Tables
    - `products`
      - `id` (serial, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `size` (text)
      - `image` (text)
      - `stock` (integer)
      - `discount` (integer)
      - `is_discounted` (boolean)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)

  2. Security
    - Enable RLS on products table
    - Add policies for public read access
    - Add policies for professional users write access
*/

CREATE TABLE IF NOT EXISTS products (
  id serial PRIMARY KEY,
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  size text,
  image text,
  stock integer NOT NULL DEFAULT 0,
  discount integer,
  is_discounted boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access"
  ON products
  FOR SELECT
  TO public
  USING (true);

-- Allow professional users full access
CREATE POLICY "Allow professional users full access"
  ON products
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_professional = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_professional = true
    )
  );

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE
    ON products
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();