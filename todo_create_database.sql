CREATE TABLE todoitems (
	id SERIAL PRIMARY KEY,
	text VARCHAR(140),
	complete boolean
);

INSERT INTO todoitems ("text", "complete") 
VALUES ('Go to grocery store', false),
('Pay electric bill', true),
('Do laundry', false),
('Finish Prime Weekend Challenge', true);