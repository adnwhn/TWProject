DROP TYPE IF EXISTS genres;
DROP TYPE IF EXISTS conditions;

CREATE TYPE genres AS ENUM('EDM', 'rock', 'hip hop', 'groove', 'unknown');
CREATE TYPE conditions AS ENUM('M', 'NM', 'VG', 'G', 'F', 'unknown');

CREATE TABLE IF NOT EXISTS discs (
   	id serial PRIMARY KEY,
   	album VARCHAR(50) NOT NULL,
   	artist VARCHAR(50) NOT NULL,
   	genre genres DEFAULT 'unknown',
	condition conditions DEFAULT 'unknown',
	release TIMESTAMP DEFAULT current_timestamp,
   	songs INT NOT NULL CHECK (songs>=0),  
	stock BOOLEAN NOT NULL DEFAULT FALSE,
	price NUMERIC(8,2) NOT NULL,
	image VARCHAR(300)
);

INSERT INTO discs (album, artist, genre, condition, release, songs, stock, price, image) VALUES
('Album A', 'A', 'EDM', 'VG', '2006-08-15', 6, True, 8.99, 'disc1.jpeg'),
('Album B', 'B', 'rock', 'G', '2019-04-03', 8, 10.00, True,'disc2.jpeg'),
('Album C', 'C', 'rock', 'VG', '1994-06-05', 10, 12.50, True,'disc3.jpeg'),
('Album D', 'D', 'rock', 'G', '1998-09-26', 12, 13.00, True,'disc4.jpeg'),
('Album E', 'E', 'EDM', 'G', '2004-02-29', 5, True, 8.99,'disc5.jpeg'),
('Album F', 'F', 'hip hop', 'VG', '1990-05-06', 14, 13.00, True,'disc6.jpeg'),
('Album G', 'G', 'rock', '1985-07-22', 'NM', 9, 11.25, True,'disc7.jpeg'),
('Album H', 'H', 'rock', 'VG', '1989-08-13', 9, 10.00, True,'disc8.jpeg'),
('Album I', 'I', 'EDM', 'NM', '2001-07-14', 6, 8.80, True,'disc9.jpeg'),
('Album J', 'J', 'groove', 'M', '2005-03-19', 8, 11.25, True,'disc10.jpeg'),
('Album K', 'K', 'EDM', 'M', '1999-01-21', 4, 7.99, True,'disc11.jpeg'),
('Album L', 'L', 'rock', 'G', '1993-04-30', 12, 12.50, True,'disc12.jpeg'),
('Album M', 'M', 'hip hop', 'F', '2009-12-02', 8, 8.99, True,'disc13.jpeg'),
('Album N', 'N', 'rock', 'F', '2020-12-02', 11, 14.10, True,'disc14.jpeg'),
('Album O', 'O', 'groove', 'NM', '2020-11-05', 9 , 11.25, True,'disc15.jpeg'),
('Album P', 'P', 'EDM', 'NM', '2012-09-27', 5, 8.99, True,'disc16.jpeg'),
('Album Q', 'Q', 'hip hop', 'M', '1995-11-30', 12, 12.50, True,'disc17.jpeg'),
('Album R', 'R', 'hip hop', 'VG', '2013-10-23', 14, 14.10, True,'disc18.jpeg');