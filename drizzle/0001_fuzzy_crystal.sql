CREATE TABLE `blog_posts` (
	`id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`author_name` varchar(100) NOT NULL DEFAULT 'Shopora Team',
	`image_url` varchar(2048),
	`read_time` varchar(50) NOT NULL DEFAULT '5 min read',
	`published_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blog_posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_posts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `campaigns` (
	`id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`banner_url` varchar(2048) NOT NULL,
	`countdown_end` timestamp,
	`coupon_code` varchar(50),
	`promo_content` text,
	`status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `campaigns_id` PRIMARY KEY(`id`),
	CONSTRAINT `campaigns_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `landing_pages` (
	`id` varchar(36) NOT NULL,
	`url` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`seo_title` varchar(255),
	`meta_description` text,
	`keywords` text,
	`canonical_url` varchar(2048),
	`og_image` varchar(2048),
	`content` text NOT NULL,
	`status` enum('DRAFT','PUBLISHED') NOT NULL DEFAULT 'DRAFT',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `landing_pages_id` PRIMARY KEY(`id`),
	CONSTRAINT `landing_pages_url_unique` UNIQUE(`url`)
);
