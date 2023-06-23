CREATE TABLE "webadminsRoles"(
	id SERIAL PRIMARY KEY,
	name VARCHAR NOT NULL UNIQUE,
	"writeAccess" BOOLEAN NOT NULL DEFAULT FALSE,
	"geolocationStartAccess" BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE webadmins(
	id SERIAL PRIMARY KEY,
	username VARCHAR NOT NULL UNIQUE,
	password VARCHAR NOT NULL,
	"roleId" INTEGER NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE regions(
	id SERIAL PRIMARY KEY,
	name VARCHAR UNIQUE NOT NULL,
	price INTEGER NOT NULL,
	"isActive" BOOLEAN DEFAULT TRUE
);

CREATE TABLE objects(
	id SERIAL PRIMARY KEY,
	"regionId" INTEGER NOT NULL,
	city VARCHAR NOT NULL,
	address VARCHAR NOT NULL,
	"isActive" BOOLEAN DEFAULT TRUE,
	"contractorId" INTEGER,
	UNIQUE (city, address)
);

CREATE TABLE organisations(
	id SERIAL PRIMARY KEY,
	name VARCHAR NOT NULL
);

CREATE TABLE employees(
	id SERIAL PRIMARY KEY,
	"chatId" VARCHAR NOT NULL,
	"fullName" VARCHAR NOT NULL,
	"birthDate" DATE NOT NULL,
	"phoneNumber" VARCHAR UNIQUE NOT NULL,
	"positionId" INTEGER NOT NULL,
	"identificationCode" VARCHAR NOT NULL,
	"clothingSizeId" INTEGER NOT NULL,
	"organisationId" INTEGER,
	"photoName" VARCHAR,
	"isFired" BOOLEAN DEFAULT FALSE
);

CREATE TABLE "positionCategories"(
	id SERIAL PRIMARY KEY,
	name VARCHAR UNIQUE NOT NULL
);

CREATE TABLE positions(
	id SERIAL PRIMARY KEY,
	"positionCategoryId" INTEGER NOT NULL,
	name VARCHAR NOT NULL UNIQUE,
	price INTEGER NOT NULL
);

CREATE TABLE "clothingSizes"(
	id SERIAL PRIMARY KEY,
	name VARCHAR UNIQUE NOT NULL
);

CREATE TABLE "workShiftsTypes"(
	id SERIAL PRIMARY KEY,
	name VARCHAR NOT NULL UNIQUE
);

CREATE TABLE "workShiftsActions"(
	id SERIAL PRIMARY KEY,
	"typeId" INTEGER NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	"employeeId" INTEGER NOT NULL,
	"objectId" INTEGER NOT NULL,
	location VARCHAR,
	car BOOLEAN,
	"businessTrip" BOOLEAN,
	"isRemainderSent" BOOLEAN
);

CREATE TABLE "registrationCodes"(
	code VARCHAR PRIMARY KEY
);

CREATE TABLE "locationChecks"(
	id SERIAL PRIMARY KEY,
	"createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	status INTEGER NOT NULL
);

CREATE TABLE "locationCheckResults"(
	"locationCheckId" INTEGER NOT NULL,
	"employeeId" INTEGER NOT NULL,
	location VARCHAR,
	working BOOLEAN NOT NULL DEFAULT TRUE,
	PRIMARY KEY ("locationCheckId", "employeeId")
);

CREATE TABLE "geocodingRequests"(
	"id" SERIAL PRIMARY KEY,
	"locationCheckId" INTEGER NOT NULL,
	"employeeId" INTEGER NOT NULL,
	coordinates VARCHAR NOT NULL
);

CREATE TABLE "telegramUsers"(
	"chatId" VARCHAR PRIMARY KEY,
	username VARCHAR,
	name VARCHAR,
	"isAdmin" BOOLEAN DEFAULT FALSE
);

CREATE TABLE contractors(
	id SERIAL PRIMARY KEY,
	"fullName" VARCHAR UNIQUE NOT NULL
);

CREATE TABLE vars(
	id SERIAL PRIMARY KEY,
	name VARCHAR UNIQUE NOT NULL,
	value VARCHAR NOT NULL
);

CREATE TABLE appeals(
	id SERIAL PRIMARY KEY,
	message VARCHAR NOT NULL UNIQUE,
	"employeeId" INTEGER NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE webadmins ADD CONSTRAINT "webadmins_fk0" FOREIGN KEY ("roleId") REFERENCES "webadminsRoles"(id);

ALTER TABLE objects ADD CONSTRAINT "objects_fk0" FOREIGN KEY ("regionId") REFERENCES regions(id);
ALTER TABLE objects ADD CONSTRAINT "objects_fk1" FOREIGN KEY ("contractorId") REFERENCES contractors(id) ON DELETE SET NULL;

ALTER TABLE employees ADD CONSTRAINT "employees_fk0" FOREIGN KEY ("chatId") REFERENCES "telegramUsers"("chatId");
ALTER TABLE employees ADD CONSTRAINT "employees_fk1" FOREIGN KEY ("positionId") REFERENCES positions(id);
ALTER TABLE employees ADD CONSTRAINT "employees_fk2" FOREIGN KEY ("clothingSizeId") REFERENCES "clothingSizes"(id);
ALTER TABLE employees ADD CONSTRAINT "employees_fk3" FOREIGN KEY ("organisationId") REFERENCES "organisations"(id);

ALTER TABLE positions ADD CONSTRAINT "positions_fk0" FOREIGN KEY ("positionCategoryId") REFERENCES "positionCategories"(id);

ALTER TABLE "workShiftsActions" ADD CONSTRAINT "workShiftsActions_fk0" FOREIGN KEY ("typeId") REFERENCES "workShiftsTypes"(id);
ALTER TABLE "workShiftsActions" ADD CONSTRAINT "workShiftsActions_fk1" FOREIGN KEY ("employeeId") REFERENCES employees(id);
ALTER TABLE "workShiftsActions" ADD CONSTRAINT "workShiftsActions_fk2" FOREIGN KEY ("objectId") REFERENCES "objects"(id);

ALTER TABLE "locationCheckResults" ADD CONSTRAINT "locationCheckResults_fk0" FOREIGN KEY ("locationCheckId") REFERENCES "locationChecks"(id);
ALTER TABLE "locationCheckResults" ADD CONSTRAINT "locationCheckResults_fk1" FOREIGN KEY ("employeeId") REFERENCES employees(id);

ALTER TABLE "geocodingRequests" ADD CONSTRAINT "geocodingRequests_fk0" FOREIGN KEY ("locationCheckId") REFERENCES "locationChecks"(id);
ALTER TABLE "geocodingRequests" ADD CONSTRAINT "geocodingRequests_fk1" FOREIGN KEY ("employeeId") REFERENCES employees(id);

ALTER TABLE appeals ADD CONSTRAINT "appeals_fk0" FOREIGN KEY ("employeeId") REFERENCES employees(id);

CREATE OR REPLACE FUNCTION deleteTelegramUsers() RETURNS TRIGGER AS $$
	BEGIN
		DELETE FROM "telegramUsers" WHERE "telegramUsers"."chatId" = OLD."chatId";
		RETURN OLD;
	END
	$$ LANGUAGE plpgsql;

CREATE TRIGGER deleteTelegramUsers
	AFTER DELETE ON employees
	FOR EACH ROW
	EXECUTE PROCEDURE deleteTelegramUsers();

ALTER SEQUENCE "clothingSizes_id_seq" RESTART WITH 1000;
ALTER SEQUENCE "employees_id_seq" RESTART WITH 1000;
ALTER SEQUENCE "geocodingRequests_id_seq" RESTART WITH 1000;
ALTER SEQUENCE "locationChecks_id_seq" RESTART WITH 1000;
ALTER SEQUENCE "objects_id_seq" RESTART WITH 1000;
ALTER SEQUENCE "organisations_id_seq" RESTART WITH 1000;
ALTER SEQUENCE "positionCategories_id_seq" RESTART WITH 1000;
ALTER SEQUENCE "positions_id_seq" RESTART WITH 1000;
ALTER SEQUENCE "regions_id_seq" RESTART WITH 1000;
ALTER SEQUENCE "webadmins_id_seq" RESTART WITH 1000;

INSERT INTO "webadminsRoles" (id, name, "writeAccess", "geolocationStartAccess")
VALUES
	(1, 'Admin', true, true),
	(2, 'Contractor', false, true);

INSERT INTO "clothingSizes" (name)
VALUES ('S'), ('M'), ('L'), ('XL'), ('XXL');

INSERT INTO "positionCategories" (id, name)
VALUES
	(1, 'ПВХ'),
	(2, 'Монтажник'),
	(3, 'Підсобник'),
	(4, 'Бляхар'),
	(5, 'Фасадник'),
	(6, 'Рубероїд');

INSERT INTO positions ("positionCategoryId", name, price)
VALUES
	(1, 'ПВХ 1 розряд', 96),
	(1, 'ПВХ 2 розряд', 84),
	(1, 'ПВХ 3 розряд', 79),
	(2, 'Монтажник 1 розряд', 77),
	(2, 'Монтажник 2 розряд', 70),
	(2, 'Монтажник 3 розряд', 66),
	(3, 'Підсобник 1 розряд', 60),
	(3, 'Підсобник 2 розряд', 55),
	(3, 'Підсобник 3 розряд', 50),
	(4, 'Бляхар 1 розряд', 78),
	(4, 'Бляхар 2 розряд', 70),
	(4, 'Бляхар 3 розряд', 60),
	(5, 'Фасадник 1 розряд', 70),
	(5, 'Фасадник 2 розряд', 60),
	(6, 'Рубероїд 1 розряд', 84),
	(6, 'Рубероїд 2 розряд', 75),
	(6, 'Рубероїд 3 розряд', 60);

INSERT INTO "workShiftsTypes" (id, name)
VALUES
    (1, 'OPEN'),
    (2, 'CLOSE');

INSERT INTO organisations (name)
VALUES
   ('Террапроф'),
   ('Маунтер'),
   ('ФОП Алі'),
   ('ЦВП');

INSERT INTO regions (id, name, price)
VALUES
	(1, 'Львівська обл.', 0),
	(2, 'Івано-Франківська обл.', 70),
	(3, 'Київська обл.', 100);

INSERT INTO objects ("regionId", city, address)
VALUES
	(1, 'м. Львів', 'вул.Антоновича, 112а'),
	(1, 'м. Львів', 'вул.Балтійська, 19'),
	(1, 'м. Львів', 'вул.Бойківська, 1'),
	(1, 'м. Львів', 'вул.Буйка, 27'),
	(1, 'м. Львів', 'вул.Валер''яна Поліщука, 78А'),
	(1, 'м. Львів', 'вул.Варшавська, 201'),
	(1, 'м. Львів', 'вул.Весела, 5'),
	(1, 'м. Львів', 'вул.Кульпарківська, 226а'),
	(1, 'м. Львів', 'вул.Володимира Великого, 10'),
	(1, 'м. Львів', 'вул.Голубовича, 34'),
	(1, 'м. Львів', 'вул.Данила Апостола, 14Б'),
	(1, 'м. Львів', 'пл.Двірцева'),
	(1, 'м. Львів', 'вул.Під Дубом, 2Б'),
	(1, 'м. Львів', 'вул.Залізнична, 7'),
	(1, 'м. Львів', 'вул.Зелена, 151'),
	(1, 'м. Львів', 'вул.Зелена, 269'),
	(1, 'м. Львів', 'вул.Карманського, 21'),
	(1, 'м. Львів', 'вул.Карманського, 6'),
	(1, 'м. Львів', 'вул.Карманського, 7а'),
	(1, 'м. Львів', 'вул.Квітки Основ''яненка, 29'),
	(1, 'м. Львів', 'вул.Котка, 20'),
	(1, 'м. Львів', 'вул.Кривчицька дорога, 19'),
	(1, 'м. Львів', 'вул.Рудненська, 16/1'),
	(1, 'м. Львів', 'вул.Лемківська, 26'),
	(1, 'м. Львів', 'вул.Лемківська, 15а'),
	(1, 'м. Львів', 'вул.Липинського, 36'),
	(1, 'м. Львів', 'вул.Льва Толстого'),
	(1, 'м. Львів', 'вул.Гетьмана І.Мазепи, 25-А,25-Б'),
	(1, 'м. Львів', 'вул.Малоголосківська'),
	(1, 'м. Львів', 'вул.Медової печери'),
	(1, 'м. Львів', 'пл.Міцкевича, 10'),
	(1, 'м. Львів', 'вул.Молдавська, 23'),
	(1, 'м. Львів', 'вул.Моршинська'),
	(1, 'м. Львів', 'вул.Ніжинська'),
	(1, 'м. Львів', 'вул.Пасіки Галицькі'),
	(1, 'м. Львів', 'вул.Панаса Мирного, 24'),
	(1, 'м. Львів', 'вул.Панчишина'),
	(1, 'м. Львів', 'вул.Стрийська, 86'),
	(1, 'м. Львів', 'вул.Кульпарківська'),
	(1, 'м. Львів', 'вул.Кульпарківська, 93'),
	(1, 'м. Львів', 'вул.Трускавецька, 3Б'),
	(1, 'м. Львів', 'вул.Пасічна, 162'),
	(1, 'м. Львів', 'вул.Пекарська'),
	(1, 'м. Львів', 'вул.Перфецького, 2'),
	(1, 'м. Львів', 'вул.Перфецького, 14'),
	(1, 'м. Львів', 'вул.Пимоненка'),
	(1, 'м. Львів', 'вул.Під Голоском'),
	(1, 'м. Львів', 'вул.Підміська'),
	(1, 'м. Львів', 'вул.Поповича, 9'),
	(1, 'м. Львів', 'вул.Очеретяна'),
	(1, 'м. Львів', 'вул.Рудненська, 8'),
	(1, 'м. Львів', 'вул.Снопківська'),
	(1, 'м. Львів', 'вул.Стрийська, 127'),
	(1, 'м. Львів', 'вул.Стрийська, 195'),
	(1, 'м. Львів', 'вул.Стрийська, 29'),
	(1, 'м. Львів', 'вул.Уласа Самчука, 16'),
	(1, 'м. Львів', 'вул.Івана Франка, 115'),
	(1, 'м. Львів', 'вул.Івана Франка, 125'),
	(1, 'м. Львів', 'вул.Шухевича, 3'),
	(1, 'м. Львів', 'вул.Ярославенка, 17-А'),
	(1, 'м. Борислав', ''),
	(1, 'м. Дрогобич', ''),
	(1, 'м. Стрий', 'вул.Шевченка, 107'),
	(1, 'с. Бірки', ''),
	(1, 'с. Вислобоки', 'вул.Садова, 14/109'),
	(1, 'с.Відники', ''),
	(1, 'с.Годовиця', ''),
	(1, 'с.Давидів', 'Примітка: (Володимир)'),
	(1, 'с.Давидів', 'Примітка: (Ярема)'),
	(1, 'с.Малечковичі', ''),
	(1, 'с.Надичі', 'вул.Грушевського, 77'),
	(1, 'с.Підберізці', ''),
	(1, 'с.Рясна-Руська', ''),
	(1, 'с.Сокільники', 'Примітка: (Галіція Котеджі)'),
	(1, 'с.Сокільники', 'вул.Г.Сковороди'),
	(1, 'с.Суховоля', ''),
	(1, 'смт.Брюховичі', ''),
	(1, 'смт.Брюховичі', 'Примітка: (Волков)'),
	(2, 'м. Івано-Франківськ', 'вул.Бельведерська'),
	(2, 'м. Івано-Франківськ', 'вул.Отця І.Блавацького'),
	(2, 'м. Івано-Франківськ', 'вул.Галицька, 201г'),
	(2, 'м. Івано-Франківськ', 'вул.Галицька, 57'),
	(2, 'м. Івано-Франківськ', 'вул.Мазепи, 144'),
	(2, 'м. Івано-Франківськ', 'вул.Мазепи, 160'),
	(2, 'м. Івано-Франківськ', 'вул.Мазепи, 164'),
	(2, 'м. Івано-Франківськ', 'вул.Вовчинецька'),
	(2, 'м. Івано-Франківськ', 'вул.Симоненка'),
	(2, 'м. Івано-Франківськ', 'вул.Шевченка'),
	(2, 'м. Івано-Франківськ', 'вул.Василіянок'),
	(2, 'м. Івано-Франківськ', 'вул.Галицька (Рівер Парк)'),
	(2, 'м. Івано-Франківськ', 'вул.Роксоляни'),
	(2, 'с.Крихівці', '(МЖК)'),
	(2, 'с.Крихівці', ''),
	(2, 'с.Поляниця', 'вул.Ділянка Щівки (Карпатський)'),
	(2, 'с.Поляниця', '(Тавель)'),
	(2, 'с.Поляниця', '(Хвоя)'),
	(2, 'с.Яблуниця', ''),
	(3, 'м.Київ', '(Кирило)'),
	(3, 'м.Київ', 'вул.Васильківська, 100 (Торонто)'),
	(3, 'м.Київ', 'вул.Оболонська-набережна, 57 (Швейцарський)'),
	(3, 'с.Дмитрівка', '');

INSERT INTO vars (name, value) VALUES
    ('carDayPayment', 100),
    ('hoursCloseWorkShiftReminder', 8),
    ('hoursAutoCloseWorkShift', 12);