-- 01 - INNER JOIN
-- Müşterileri siparişleriyle birleştir.
-- En son verilen 10 siparişi getir.

SELECT
    u.id AS user_id,
    u.first_name,
    u.last_name,
    o.id AS order_id,
    o.created_at
FROM users u
INNER JOIN orders o
    ON u.id = o.user_id
ORDER BY o.created_at DESC
LIMIT 10;