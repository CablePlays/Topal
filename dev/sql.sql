-- INSERT INTO users VALUES (1, "dummy1@treverton.co.za");
-- INSERT INTO users VALUES (2, "dummy2@treverton.co.za");
-- INSERT INTO users VALUES (3, "dummy3@treverton.co.za");

SELECT * FROM users;
SELECT SUM(distance) AS total FROM running_logs WHERE user = 3;
SELECT * FROM running_logs;