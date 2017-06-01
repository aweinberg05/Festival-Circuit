-- remove any records and start the id sequence back to 1
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS festivals CASCADE;
DROP TABLE IF EXISTS attending;

-- add create tables here
CREATE TABLE users (
id SERIAL PRIMARY KEY,
email VARCHAR(255) UNIQUE,
password_digest VARCHAR(255),
user_name VARCHAR(50) UNIQUE,
country varchar(255),
city_or_state varchar(255),
profile_pic varchar(255),
fave_genre varchar(255),
fave_festival varchar(255),
festival_pictures varchar(10000)
);

CREATE TABLE festivals (
id serial PRIMARY KEY,
name varchar(255),
date varchar (255),
country varchar(255),
city_or_state varchar(255),
festival_image varchar(255),
description varchar (10000)
);


CREATE TABLE attending (
id serial PRIMARY KEY,
rsvp varchar (255),
comment varchar (255),
user_id INTEGER REFERENCES users(id),
festival_id INTEGER REFERENCES festivals(id)
);

INSERT INTO users
  (email, password_digest, user_name, country, city_or_state, profile_pic, fave_genre, fave_festival, festival_pictures)
VALUES
  ('aweinberg05@gmail.com', '$2a$10$oiDkOM0PsLhMzR3xPGdWOuXWDGDAfiOuFSVnf/VUZIo', 'HashMeOutsideHowBowDah', 'USA','NY','https://scontent-iad3-1.xx.fbcdn.net/v/t1.0-9/14718765_10107245015278123_1453619577380225262_n.jpg?oh=abaaef6e20658d42d8a6b25bc7e88a2c&oe=5990D665','trance, deephouse', 'EDC Vegas', 'https://www.instagram.com/p/BIKuBZsj2PxoAL4xB3wKFTFFF2ryEwHX1_QxIw0/?taken-by=aweinberg05'),
  ('kirby123@gmail.com', '$2a$10$oiDkOM0PsLhMzR3xPGdWOuXWDGDAfiOuFSVnf/VUZIo', 'ArrayOfLight', 'Mexico','Cancun','https://scontent-iad3-1.xx.fbcdn.net/v/t1.0-9/14642494_10154234077638197_3381833006555105121_n.jpg?oh=aad6d8b98d77511e8418c880f4f0ee7d&oe=59905A58','techno, dubstep, deephouse', 'Ultra', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHlrrIt6k4QMcUm24EOeRJ0CyTM0fm5L8K6SvlnzwHz5KTg0_4'),
  ('Jason@gmail.com', 'HAS777H1234', 'JumpingJSON', 'South America', 'Brazil', 'https://scontent-lga3-1.xx.fbcdn.net/v/t1.0-9/14992068_10105113720440098_2437503570609330744_n.jpg?oh=95cc313fefa83ca5ddbfe543dd3f55aa&oe=598DA8C9', 'deephouse, techno', 'Ultra Europe', 'https://scontent-lga3-1.xx.fbcdn.net/v/t1.0-9/764_10153463833042113_4079961120187888451_n.jpg?oh=01078516e2df6fbf5ed7b8a6db245c79&oe=595B9608'),
  ('Juan@Juanmail.com', 'HASH6661234', 'OjectOfMyAffection', 'USA', 'Miami', 'https://scontent-lga3-1.xx.fbcdn.net/v/t1.0-1/p240x240/11215097_1062772667081181_382836203658296656_n.jpg?oh=f3f6f1386b6f291d507673929c823091&oe=595425DE', 'Big House, Progressive House, Trance', 'Ezoo', ''),
  ('Jenn@ymail.com', 'HASH5551234', 'SpliceGirls', 'London', 'UK', 'https://scontent-lga3-1.xx.fbcdn.net/v/t1.0-9/13178890_10103049545997328_3786377252638701489_n.jpg?oh=0934d08c87c5626607cf80db85fa7082&oe=598E48DB', 'All of it', 'Tomorrowland', '');
INSERT INTO festivals
  (name, date, country, city_or_state, festival_image, description)
VALUES
  ('EDC Vegas', 'Jun 16 - Jun 18, 2017', 'United States', 'Las Vegas', 'https://cdn-assets.insomniac.com/10rookiemistakes_1120x470.jpg', 'Vegas is home to the biggest celebration for electronic dance music lovers, EDC – Electric Daisy Carnival. More than 300,000 revelers head to the Las Vegas Motor Speedway June 16 - 19, 2017 for the festival, which features art, carnival rides, circus-style performances and all of the top EDM DJs.'),
  ('Creamfields', 'Aug 24 - Aug 27, 2017', 'United Kingdom', 'Daresbury', 'http://bpm-sfx.com/wp-content/uploads/2013/09/creamfields-2013-flames-3-840x411.jpg', '2017 marks a landmark year for Creamfields as it celebrates its 20th anniversary. Undoubtedly one of the world’s biggest electronic music festivals, Creamfields returns to the Cheshire countryside for 4 days, Thursday, August 24th through August 27th, 2017. Hosting over 30 stages and over 300 artists, it would be quicker to name the few artists who are not playing.'),
  ('Tomorrowland', 'Jul 21 – Jul 30, 2017', 'Belgium', 'Boom', 'http://www.edmsauce.com/wp-content/uploads/2015/08/11055355_10153236545434177_3865099953252782933_o.jpg', 'Tomorrowland is without doubt the biggest and most important dance music festival on the planet. House, EDM, techno, drum & bass, hardstyle and every other corner of electronic music is represented by worldwide superstars, all staged amongst the highest levels of production known to humankind.
With every single detail of the festival experience covered, a trip to Tomorrowland leaves a lasting impression that long outlives the party marathon of the festival itself.  And with this level of popularity comes mind-blowing demand: tickets and packages have always sold out in a matter of minutes. For anyone lucky enough to have been, it is guaranteed to have been the weekend of a lifetime'),
('Electric Forest', 'Jun 22 - Jun 25, and Jun 29 - Jul 2, 2017', 'United States', 'Michigan', 'http://images.thissongissick.com/c_scale-f_auto-w_706-v1460863394-tsis-2016-03-ef-co-png-png.jpg', 'Electric Forest Festival is a eight day two weekend multi-genre event, with a focus on electronic and jam band genres, held in Rothbury, Michigan, at the Double JJ Resort. The original event was called Rothbury Festival, debuted in 2008, and focused on jam bands and rock bands.  Electric Forest, which debuted in 2011, is co-produced by Insomniac Events and Madison House. The 2015 event drew an estimated 45,000 attendees.'),
('Electric Zoo Festival', 'Sep 1 – Sep 3, 2017', 'United States', 'New York', 'http://djnews.com.br/wp-content/uploads/2016/12/14732190_10154270968408025_3870585723246469477_n.jpg', 'Electric Zoo is an annual electronic music festival held over Labor Day weekend in New York City on Randalls Island. The festival represents all genres of electronic music, bringing top international DJs and live acts from multiple countries to four stages.  In its 2009 inaugural year, 26,000 people attended to see artists Armin van Buuren, Deadmau5, David Guetta and Ferry Corsten. In 2011, Electric Zoo expanded to a 3-day festival and with 85,000 attendees. Electric Zoo received International Dance Music Awards nominations in 2010, 2011, 2012, and 2013 for "Best Music Event".'); 

INSERT INTO attending
  (rsvp, comment, user_id, festival_id)
VALUES
 ('All in!', 'psyched!', 2, 1),
 ('All in!', 'Cannot wait!', 1, 2),
 ('On the fence', 'Saving up dough', 2, 3),
 ('All in!', 'What is the weather like in Michigan during this time?', 1, 4),
 ('On the fence', 'If Im in town!', 1, 5);
