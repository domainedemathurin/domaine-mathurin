/*
  # Ajout du rôle administrateur
  
  1. Modifications
    - Ajout d'une colonne is_admin à la table auth.users
    - Création d'une politique RLS pour l'accès admin
    - Attribution du rôle admin à l'utilisateur spécifié
*/

-- Ajout de la colonne is_admin si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'auth' 
    AND table_name = 'users' 
    AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE auth.users ADD COLUMN is_admin boolean DEFAULT false;
  END IF;
END $$;

-- Définir votre email comme administrateur
UPDATE auth.users
SET is_admin = true
WHERE email = 'votre-email@example.com';  -- Remplacez par votre email

-- Politique RLS pour l'accès administrateur
CREATE POLICY "Allow full access for admins"
ON public.orders
FOR ALL
TO authenticated
USING (
  (SELECT is_admin FROM auth.users WHERE id = auth.uid())
)
WITH CHECK (
  (SELECT is_admin FROM auth.users WHERE id = auth.uid())
);