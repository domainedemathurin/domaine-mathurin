/*
  # Create initial schema

  1. New Tables
    - `contacts` table for storing contact information
      - `id` (uuid, primary key)
      - `address` (text)
      - `phone` (text)
      - `email` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `contacts` table
    - Add policy for authenticated admins to manage contacts
    - Add policy for public to view contacts
*/

CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  address text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public to view contacts"
  ON contacts
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow admins to manage contacts"
  ON contacts
  FOR ALL
  TO authenticated
  USING (
    (SELECT is_admin FROM auth.users WHERE id = auth.uid())
  )
  WITH CHECK (
    (SELECT is_admin FROM auth.users WHERE id = auth.uid())
  );

-- Insert initial contact information
INSERT INTO contacts (address, phone, email)
VALUES (
  'Place de la Fontaine, Miramas le vieux, 13140',
  '+33 6 83 77 66 85',
  'contact@domainedemathurin.fr'
);