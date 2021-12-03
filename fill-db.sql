
INSERT INTO users(email, password_hash, firstname, lastname, avatar) VALUES
('ivanov@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'Иван', 'Иванов', 'avatar1.jpg'),
('petrov@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'Пётр', 'Петров', 'avatar2.jpg');

INSERT INTO categories(name) VALUES
('Книги'),
('Разное'),
('Посуда'),
('Игры'),
('Животные'),
('Журналы');
ALTER TABLE offers DISABLE TRIGGER ALL;

INSERT INTO offers(title, description, type, sum, picture, user_id) VALUES
('Отдам в хорошие руки подшивку «Мурзилка».', 'Кому нужен этот новый телефон если тут такое... Не пытайтесь торговаться. Цену вещам я знаю. Две страницы заляпаны свежим кофе. Таких предложений больше нет!', 'offer', '41739', 'item05.jpg', 2),
('Продам отличную подборку фильмов на VHS.', 'Продаю с болью в сердце... Если найдёте дешевле — сброшу цену. Мой дед не мог её сломать. Не пытайтесь торговаться. Цену вещам я знаю.', 'offer', '33796', 'item03.jpg', 1),
('Куплю антиквариат.', 'Мой дед не мог её сломать. При покупке с меня бесплатная доставка в черте города. Кажется что это хрупкая вещь. Если найдёте дешевле — сброшу цену.', 'sale', '40304', 'item10.jpg', 1),
('Отдам в хорошие руки подшивку «Мурзилка».', 'При покупке с меня бесплатная доставка в черте города. Кажется что это хрупкая вещь. Две страницы заляпаны свежим кофе. Продаю с болью в сердце...', 'offer', '58653', 'item06.jpg', 1),
('Продам советскую посуду. Почти не разбита.', 'Кому нужен этот новый телефон если тут такое... Продаю с болью в сердце... Это настоящая находка для коллекционера! Мой дед не мог её сломать.', 'offer', '20494', 'item11.jpg', 2);
ALTER TABLE offers ENABLE TRIGGER ALL;

ALTER TABLE offers_categories DISABLE TRIGGER ALL;
INSERT INTO offers_categories(offer_id, category_id) VALUES
(1, 4),
(2, 5),
(3, 6),
(4, 4),
(5, 1);
ALTER TABLE offers_categories ENABLE TRIGGER ALL;

ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO COMMENTS(text, user_id, offer_id) VALUES
('Вы что?! В магазине дешевле. Продаю в связи с переездом. Отрываю от сердца.', 1, 1),
('А где блок питания?', 2, 1),
('Неплохо, но дорого. Вы что?! В магазине дешевле. Совсем немного...', 1, 1),
('Вы что?! В магазине дешевле. Продаю в связи с переездом. Отрываю от сердца.', 2, 1),
('Почему в таком ужасном состоянии? Вы что?! В магазине дешевле. Неплохо, но дорого.', 1, 2),
('Неплохо, но дорого. А где блок питания? А сколько игр в комплекте?', 2, 2),
('Почему в таком ужасном состоянии?', 2, 2),
('А где блок питания? А сколько игр в комплекте? Оплата наличными или перевод на карту?', 2, 2),
('Вы что?! В магазине дешевле. Продаю в связи с переездом. Отрываю от сердца. А где блок питания?', 1, 3),
('А сколько игр в комплекте? Вы что?! В магазине дешевле.', 1, 3),
('Вы что?! В магазине дешевле.', 2, 3),
('А где блок питания? Продаю в связи с переездом. Отрываю от сердца.', 2, 3),
('Оплата наличными или перевод на карту? Неплохо, но дорого.', 1, 4),
('Почему в таком ужасном состоянии?', 1, 4),
('Вы что?! В магазине дешевле.', 1, 4),
('А где блок питания? Почему в таком ужасном состоянии?', 1, 4),
('Почему в таком ужасном состоянии? Продаю в связи с переездом. Отрываю от сердца.', 2, 5),
('Оплата наличными или перевод на карту? А сколько игр в комплекте?', 1, 5),
('Совсем немного... Продаю в связи с переездом. Отрываю от сердца.', 2, 5),
('Почему в таком ужасном состоянии?', 1, 5);
ALTER TABLE comments ENABLE TRIGGER ALL;