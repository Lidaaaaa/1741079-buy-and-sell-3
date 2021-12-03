-- all categories
SELECT * from categories;

-- not empty categories
SELECT
  categories.id,
  categories.name
FROM categories
  JOIN offers_categories ON categories.id = offers_categories.category_id
GROUP BY categories.id;

-- count offer by category
SELECT
  categories.id,
  categories.name,
  COUNT(offers_categories.offer_id)
FROM categories
  JOIN offers_categories ON categories.id = offers_categories.category_id
GROUP BY categories.id;

-- offer list
SELECT
  offers.*,
  CONCAT(users.lastname, ' ', users.firstname),
  users.email,
  COUNT(comments.id) AS "comments count",
  STRING_AGG(DISTINCT categories.name, ', ') AS "category list"
FROM offers
  JOIN users ON users.id = offers.user_id
  LEFT JOIN comments ON comments.offer_id = offers.id
  JOIN offers_categories ON offers_categories.offer_id = offers.id
  JOIN categories ON categories.id = offers_categories.category_id
GROUP BY offers.id, users.id
ORDER BY offers.created_at DESC;

-- offer by id
SELECT
  offers.*,
  CONCAT(users.lastname, ' ', users.firstname),
  users.email,
  COUNT(comments.id) AS "comments count",
  STRING_AGG(DISTINCT categories.name, ', ') AS "category list"
FROM offers
  JOIN users ON users.id = offers.user_id
  LEFT JOIN comments ON comments.offer_id = offers.id
  JOIN offers_categories ON offers_categories.offer_id = offers.id
  JOIN categories ON categories.id = offers_categories.category_id
WHERE offers.id = 1
GROUP BY offers.id, users.id;

-- last 5 comments
SELECT
	comments.id,
	comments.offer_id,
	CONCAT(users.lastname,  ', ', users.firstname) AS "author",
	comments.text
FROM comments
	JOIN users ON users.id = comments.user_id
ORDER BY comments.created_at DESC
LIMIT 5;

-- comment by offer id
SELECT
	comments.id,
	comments.offer_id,
	CONCAT(users.lastname,  ', ', users.firstname) AS "author",
	comments.text
FROM comments
	JOIN users ON users.id = comments.user_id
WHERE comments.offer_id = 1
ORDER BY comments.created_at DESC;

-- 2 offers with offer type
SELECT *
FROM offers
WHERE offers.type = 'offer'
LIMIT 2;

-- update title for offer with id equal 1
UPDATE offers
SET title = 'Уникальное предложение!'
WHERE id = 1;
