USE `tracker`;


DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
    `id` BIGINT unsigned AUTO_INCREMENT,
    `name` varchar(255) NOT NULL, 
    `email` varchar(255) NOT NULL UNIQUE,
    `password` varchar(255) NOT NULL,
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP, 
    `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
);

INSERT INTO
    `users`(`name`, `email`, `password`)

VALUES
('John Doe', 'johndoe1@example.com', '$2b$08$V38UShGPRc0Yr90nT3vEjOgIpaI2D5L42FGC1bZ54SS4z.xZee0Wy')