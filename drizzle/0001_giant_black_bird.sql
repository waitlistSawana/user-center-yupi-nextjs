CREATE TABLE `user-center-yupi-nextjs_user` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`username` varchar(256),
	`userAccount` varchar(256),
	`avatarUrl` varchar(1024),
	`gender` tinyint,
	`userPassword` varchar(512) NOT NULL,
	`phone` varchar(128),
	`email` varchar(512),
	`userStatus` int NOT NULL DEFAULT 0,
	`createTime` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updateTime` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`isDelete` tinyint NOT NULL DEFAULT 0,
	`userRole` int NOT NULL DEFAULT 0,
	`planetCode` varchar(512),
	CONSTRAINT `user-center-yupi-nextjs_user_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `username_idx` ON `user-center-yupi-nextjs_user` (`username`);--> statement-breakpoint
CREATE INDEX `user_account_idx` ON `user-center-yupi-nextjs_user` (`userAccount`);--> statement-breakpoint
CREATE INDEX `user_status_idx` ON `user-center-yupi-nextjs_user` (`userStatus`);--> statement-breakpoint
CREATE INDEX `user_role_idx` ON `user-center-yupi-nextjs_user` (`userRole`);