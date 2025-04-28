/*
  # Initialisation des produits

  1. Ajout des produits initiaux
    - Huile d'Olive AOP d'Aix-en-Provence
    - Huile d'Olive Fruitée Noire
    - Huile d'Olive au Basilic
*/

INSERT INTO products (name, description, price, size, image, stock)
VALUES 
  (
    'Huile d''Olive AOP d''Aix-en-Provence',
    'Notre huile d''olive AOP d''Aix-en-Provence est obtenue exclusivement par des procédés mécaniques. Elle présente un nez caractérisé par l''herbe fraîche et l''artichaut cru, complétés de notes de noix et de fruits rouges. En fin de bouche, le poivré peut être perçu avec une amertume modérée.',
    15.00,
    '500ml',
    '/products/huile-aop.png',
    50
  ),
  (
    'Huile d''Olive Fruitée Noire',
    'Recette ancestrale et traditionnelle, le fruité noir est caractérisé par des arômes d''olives confites, de cacao, de tapenade et de truffes. Cette huile maturée ne dévoile en bouche ni ardence, ni amertume, offrant une expérience gustative unique.',
    10.00,
    '500ml',
    '/products/huile-noire.png',
    35
  ),
  (
    'Huile d''Olive au Basilic',
    'Un classique méditerranéen incontournable. Le basilic, pressé en même temps que les olives, confère à cette huile son goût typique. Appréciée pour son incroyable fraîcheur et son authenticité, elle sublime vos plats méditerranéens.',
    10.00,
    '500ml',
    '/products/huile-basilic.png',
    40
  );