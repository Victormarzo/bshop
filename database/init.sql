CREATE TABLE IF NOT EXISTS "users" (
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	"number" varchar(255) NOT NULL UNIQUE,
	PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "services" (
	"duration" bigint NOT NULL,
	"value" bigint NOT NULL,
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	PRIMARY KEY ("id")
);

CREATE TYPE role as ENUM ('ADMIN','CLIENT');

CREATE TABLE IF NOT EXISTS "barbers" (
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"number" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"role" role DEFAULT 'CLIENT',
	PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "barberShop" (
	"cep" bigint NOT NULL,
	"number" bigint NOT NULL,
	"name" varchar(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS "barberSessions" (
	"id" serial NOT NULL,
	"token" varchar(255) NOT NULL,
	"barberId" bigint NOT NULL,
	PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "barberServices" (
	"id" serial NOT NULL,
	"serviceId" bigint NOT NULL,
	"barberId" bigint NOT NULL,
	PRIMARY KEY ("id")
);

CREATE TYPE status AS ENUM ('AGENDADO', 'EM ANDAMENTO', 'FINALIZADO');

CREATE TABLE IF NOT EXISTS "schedules" (
	"id" serial NOT NULL,
	"userId" bigint NOT NULL,
	"barberId" bigint NOT NULL,
	"serviceId" bigint NOT NULL,
	"date" char(10) NOT NULL,
	"time" char(5) NOT NULL,
	"endTime" char(5) NOT NULL,
	"status" status DEFAULT 'AGENDADO',
	PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "workingInterval" (
	"id" serial NOT NULL,
	"barberId" bigint NOT NULL,
	"dayList" varchar(255) NOT NULL,
	PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "dayOff" (
	"id" serial NOT NULL,
	"barberId" bigint NOT NULL,
	"date" char(10) NOT NULL,
	PRIMARY KEY ("id")
);
ALTER TABLE "barberSessions" ADD CONSTRAINT "barberSessions_fk2" FOREIGN KEY ("barberId") REFERENCES "barbers"("id");

ALTER TABLE "schedules" ADD CONSTRAINT "schedules_fk2" FOREIGN KEY ("userId") REFERENCES "users"("id");

ALTER TABLE "workingInterval" ADD CONSTRAINT "workingInterval_fk2" FOREIGN KEY ("barberId") REFERENCES "barbers"("id");

ALTER TABLE "dayOff" ADD CONSTRAINT "dayOff_fk2" FOREIGN KEY ("barberId") REFERENCES "barbers"("id");

ALTER TABLE "schedules" ADD CONSTRAINT "schedules_fk3" FOREIGN KEY ("barberId") REFERENCES "barbers"("id");

ALTER TABLE "schedules" ADD CONSTRAINT "schedules_fk5" FOREIGN KEY ("serviceId") REFERENCES "services"("id");

ALTER TABLE "barberServices" ADD CONSTRAINT "barberServices_fk2" FOREIGN KEY ("barberId") REFERENCES "barbers"("id");

ALTER TABLE "barberServices" ADD CONSTRAINT "barberServices_fk3" FOREIGN KEY ("serviceId") REFERENCES "services"("id");

INSERT INTO "barbers" (number,password,name,email) VALUES ('41999024887','1234','Bruno','bruno@email.com'),('41999024887','1235','Lucas','lucas@email.com');

INSERT INTO "services" (duration,value,name) VALUES (20,4000,'Corte degrade'),(20,4000,'Barba'),(40,7000,'Corte degrade + barba'),(30,5000,'Trança'),(50,8500,'Trança + barba');

INSERT INTO "barberServices" ("barberId","serviceId") VALUES (1,1),(1,2),(1,3),(2,2),(2,4),(2,5);

INSERT INTO "workingInterval" ("barberId","dayList") VALUES (1,'1,2,3,4,5,6');

INSERT INTO "dayOff" ("barberId",date) VALUES (1,'2025-03-14'),(1,'2025-03-15');

INSERT INTO "users" (name,number) VALUES ('Victor','41999024886'),('Matheus','41999024882');

INSERT INTO "schedules" ("barberId",date,"userId","serviceId", time, "endTime", status) VALUES (1,'2025-03-16',1,3,'15:30','16:10','AGENDADO'),(1,'2025-03-16',1,3,'17:30','18:10','AGENDADO'),(1,'2025-03-17',1,3,'15:30','16:10','AGENDADO'),(1,'2025-03-12',1,3,'12:00','12:40','AGENDADO');