DROP TABLE IF EXISTS discs;

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
	explicitContent BOOLEAN NOT NULL DEFAULT FALSE,
	price NUMERIC(8,2) NOT NULL,
	image VARCHAR(300),
	composers VARCHAR [],
	description TEXT,
	stock INT NOT NULL DEFAULT 0
);

INSERT INTO discs (album, artist, genre, condition, release, songs, price, explicitContent, image, composers, description, stock) VALUES
('Album A', 'A', 'EDM', 'VG', '2006-08-15', 6, 8.99, False, 'disc1.jpeg', '{"Comp A", "Comp B"}', 'Description for disc A, genre EDM, released in 2006.', 2),
('Album B', 'B', 'rock', 'G', '2019-04-03', 8, 10.00, True,'disc2.jpeg', '{"Comp AB", "Comp BC", Comp D}', 'Description for disc B, genre rock, released in 2019.', 1),
('Album C', 'C', 'rock', 'VG', '1994-06-05', 10, 12.50, False,'disc3.jpeg', '{"Comp A", "Comp BC"}', 'Description for disc C, genre rock, released in 1994.', 2),
('Album D', 'D', 'rock', 'G', '1998-09-26', 12, 13.00, True,'disc4.jpeg', '{"Comp D", "Comp E", "Comp CD"}', 'Description for disc D, genre rock, released in 1998.', 0),
('Album E', 'E', 'EDM', 'G', '2004-02-29', 5, 8.99, True,'disc5.jpeg', '{"Comp ABC", "Comp D"}', 'Description for disc E, genre EDM, released in 2004.', 3),
('Album F', 'F', 'hip hop', 'VG', '1990-05-06', 14, 13.00, False,'disc6.jpeg', '{"Comp A", "Comp B", "Comp C"}', 'Description for disc F, genre hip hop, released in 1990.', 3),
('Album G', 'G', 'rock', 'NM', '1985-07-22', 9, 11.25, False,'disc7.jpeg', '{"Comp ABCD", "Comp E"}', 'Description for disc G, genre rock, released in 1985.', 2),
('Album H', 'H', 'rock', 'VG', '1989-08-13', 9, 10.00, True,'disc8.jpeg', '{"Comp C", "Comp BDE", "Comp BE"}', 'Description for disc H, genre rock, released in 1989.', 0),
('Album I', 'I', 'EDM', 'NM', '2001-07-14', 6, 8.80, True,'disc9.jpeg', '{"Comp CD", "Comp BE"}', 'Description for disc I, genre EDM, released in 2001.', 1),
('Album J', 'J', 'groove', 'M', '2005-03-19', 8, 11.25, False,'disc10.jpeg', '{"Comp A", "Comp CD", "Comp ABCD"}', 'Description for disc J, genre groove, released in 2005.', 1),
('Album K', 'K', 'EDM', 'M', '1999-01-21', 4, 7.99, True,'disc11.jpeg', '{"Comp ABCD", "Comp BDE", "Comp BE"}', 'Description for disc K, genre EDM, released in 1999.', 4),
('Album L', 'L', 'rock', 'G', '1993-04-30', 12, 12.50, False,'disc12.jpeg', '{"Comp A", "Comp BDE", "Comp BE"}', 'Description for disc L, genre rock, released in 1993.', 1),
('Album M', 'M', 'hip hop', 'F', '2009-12-02', 8, 8.99, True,'disc13.jpeg', '{"Comp AB", "Comp BDE", "Comp E"}', 'Description for disc M, genre hip hop, released in 2009.', 4),
('Album N', 'N', 'rock', 'F', '2020-12-02', 11, 14.10, False,'disc14.jpeg', '{"Comp D", "Comp BDE", "Comp CD"}', 'Description for disc N, genre rock, released in 2020.', 2),
('Album O', 'O', 'groove', 'NM', '2020-11-05', 9 , 11.25, False,'disc15.jpeg', '{"Comp ABCD", "Comp BDE", "Comp BE"}', 'Description for disc O, genre groove, released in 2020.', 0),
('Album P', 'P', 'EDM', 'NM', '2012-09-27', 5, 8.99, False,'disc16.jpeg', '{"Comp BC", "Comp E", "Comp BE", "Comp ABC"}', 'Description for disc P, genre EDM, released in 2012.', 5),
('Album Q', 'Q', 'hip hop', 'M', '1995-11-30', 12, 12.50, False,'disc17.jpeg', '{"Comp ABCD", "Comp D", "Comp B"}', 'Description for disc Q, genre hip hop, released in 1995.', 1),
('Album R', 'R', 'hip hop', 'VG', '2013-10-23', 14, 14.10, True,'disc18.jpeg', '{"Comp ABC", "Comp BDE", "Comp E"}', 'Description for disc R, genre hip hop, released in 2013.', 2);