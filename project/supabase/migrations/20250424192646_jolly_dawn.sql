/*
  # Update contact email

  1. Changes
    - Update email in contacts table to domainedemathurin@gmail.com
*/

UPDATE contacts
SET 
  email = 'domainedemathurin@gmail.com',
  updated_at = now()
WHERE id = (SELECT id FROM contacts LIMIT 1);