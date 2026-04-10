CREATE TABLE `syncLog` (
	`id` int AUTO_INCREMENT NOT NULL,
	`syncType` varchar(32) NOT NULL,
	`syncedAt` timestamp NOT NULL DEFAULT (now()),
	`itemCount` int DEFAULT 0,
	`status` varchar(32) DEFAULT 'success',
	`details` text,
	CONSTRAINT `syncLog_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`taskNumber` varchar(64) NOT NULL,
	`title` text,
	`owner` varchar(255),
	`ownerEmail` varchar(320),
	`progress` varchar(32),
	`priority` varchar(32),
	`creationDate` varchar(32),
	`tags` text,
	`taskLink` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`externalId` varchar(128) NOT NULL,
	`subject` text,
	`testType` varchar(64),
	`status` varchar(32) NOT NULL DEFAULT 'Active',
	`brand` varchar(255),
	`client` varchar(255),
	`clientEmail` varchar(320),
	`firstDate` varchar(32),
	`lastActivity` varchar(32),
	`messageCount` int DEFAULT 0,
	`snippet` text,
	`gmailLink` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tickets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`externalId` varchar(128) NOT NULL,
	`type` varchar(32) NOT NULL,
	`subject` text,
	`issue` text,
	`status` varchar(32) NOT NULL DEFAULT 'Open',
	`client` varchar(255),
	`clientEmail` varchar(320),
	`clientCompany` varchar(255),
	`firstDate` varchar(32),
	`lastActivity` varchar(32),
	`messageCount` int DEFAULT 0,
	`priority` varchar(32) DEFAULT 'Medium',
	`snippet` text,
	`gmailLink` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tickets_id` PRIMARY KEY(`id`)
);
