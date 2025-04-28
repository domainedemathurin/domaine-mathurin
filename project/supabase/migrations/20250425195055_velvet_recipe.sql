/*
  # Tables pour l'analyse de la consommation

  1. Nouvelles Tables
    - `analytics_pageviews` : Suivi des vues de pages
      - `id` (uuid, clé primaire)
      - `path` (text, chemin de la page)
      - `session_id` (text, identifiant de session)
      - `user_id` (uuid, référence à auth.users)
      - `timestamp` (timestamptz, horodatage)
    
    - `analytics_product_views` : Suivi des vues de produits
      - `id` (uuid, clé primaire)
      - `product_id` (integer, référence à products)
      - `session_id` (text, identifiant de session)
      - `user_id` (uuid, référence à auth.users)
      - `timestamp` (timestamptz, horodatage)

  2. Sécurité
    - RLS activé sur les deux tables
    - Politiques pour limiter l'accès aux administrateurs
*/

-- Table des vues de pages
CREATE TABLE analytics_pageviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL,
  session_id text NOT NULL,
  user_id uuid REFERENCES auth.users,
  timestamp timestamptz NOT NULL DEFAULT now()
);

-- Table des vues de produits
CREATE TABLE analytics_product_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id integer REFERENCES products,
  session_id text NOT NULL,
  user_id uuid REFERENCES auth.users,
  timestamp timestamptz NOT NULL DEFAULT now()
);

-- Activer RLS
ALTER TABLE analytics_pageviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_product_views ENABLE ROW LEVEL SECURITY;

-- Politiques pour les administrateurs
CREATE POLICY "Allow admin access to pageviews"
  ON analytics_pageviews
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_professional = true
    )
  );

CREATE POLICY "Allow admin access to product views"
  ON analytics_product_views
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_professional = true
    )
  );

-- Vues pour les analyses
CREATE VIEW analytics_daily_pageviews AS
SELECT 
  date_trunc('day', timestamp) as day,
  count(*) as views,
  count(DISTINCT session_id) as unique_visitors
FROM analytics_pageviews
GROUP BY 1
ORDER BY 1;

CREATE VIEW analytics_product_popularity AS
SELECT 
  p.name,
  count(*) as views,
  count(DISTINCT apv.session_id) as unique_views
FROM analytics_product_views apv
JOIN products p ON p.id = apv.product_id
GROUP BY p.id, p.name
ORDER BY views DESC;