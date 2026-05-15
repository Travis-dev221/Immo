-- =============================================================================
-- VENTURE — schéma MySQL + données de démonstration
-- =============================================================================
-- Utilisation (XAMPP / phpMyAdmin) :
--   1. Ouvrez http://localhost/phpmyadmin
--   2. Onglet « Importer » ou « SQL »
--   3. Choisissez ce fichier (ou collez tout le contenu dans l’onglet SQL)
--
-- La base `venture` est créée automatiquement si elle n’existe pas.
-- Comptes démo (mot de passe : demo123456) :
--   admin@venture.demo  |  agent@venture.demo  |  user@venture.demo
-- =============================================================================
CREATE DATABASE IF NOT EXISTS `venture` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `venture`;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `Contact`;
DROP TABLE IF EXISTS `Favorite`;
DROP TABLE IF EXISTS `Property`;
DROP TABLE IF EXISTS `Session`;
DROP TABLE IF EXISTS `Account`;
DROP TABLE IF EXISTS `VerificationToken`;
DROP TABLE IF EXISTS `User`;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `emailVerified` DATETIME NULL,
    `image` VARCHAR(191) NULL,
    `passwordHash` VARCHAR(191) NULL,
    `role` ENUM('USER', 'AGENT', 'ADMIN') NOT NULL DEFAULT 'USER',
    `avatar` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY `User_email_key` (`email`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INT NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,

    UNIQUE KEY `Account_provider_providerAccountId_key` (`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expires` DATETIME NOT NULL,

    UNIQUE KEY `Session_sessionToken_key` (`sessionToken`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `VerificationToken` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME NOT NULL,

    UNIQUE KEY `VerificationToken_token_key` (`token`),
    UNIQUE KEY `VerificationToken_identifier_token_key` (`identifier`, `token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Property` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `price` DOUBLE NOT NULL,
    `surface` DOUBLE NOT NULL,
    `rooms` INT NOT NULL,
    `bedrooms` INT NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `postalCode` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `type` ENUM('SALE', 'RENT') NOT NULL,
    `status` ENUM('PENDING', 'PUBLISHED', 'SOLD') NOT NULL DEFAULT 'PENDING',
    `images` LONGTEXT NOT NULL,
    `viewCount` INT NOT NULL DEFAULT 0,
    `contactCount` INT NOT NULL DEFAULT 0,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    KEY `Property_city_idx` (`city`),
    KEY `Property_type_status_idx` (`type`, `status`),
    KEY `Property_latitude_longitude_idx` (`latitude`, `longitude`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Favorite` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `propertyId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY `Favorite_userId_propertyId_key` (`userId`, `propertyId`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Contact` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `propertyId` VARCHAR(191) NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    KEY `Contact_propertyId_idx` (`propertyId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `Account`
ADD CONSTRAINT `Account_userId_fkey`
FOREIGN KEY (`userId`) REFERENCES `User`(`id`)
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Session`
ADD CONSTRAINT `Session_userId_fkey`
FOREIGN KEY (`userId`) REFERENCES `User`(`id`)
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Property`
ADD CONSTRAINT `Property_userId_fkey`
FOREIGN KEY (`userId`) REFERENCES `User`(`id`)
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Favorite`
ADD CONSTRAINT `Favorite_userId_fkey`
FOREIGN KEY (`userId`) REFERENCES `User`(`id`)
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Favorite`
ADD CONSTRAINT `Favorite_propertyId_fkey`
FOREIGN KEY (`propertyId`) REFERENCES `Property`(`id`)
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Contact`
ADD CONSTRAINT `Contact_propertyId_fkey`
FOREIGN KEY (`propertyId`) REFERENCES `Property`(`id`)
ON DELETE SET NULL ON UPDATE CASCADE;

INSERT INTO `User`
(`id`, `name`, `email`, `emailVerified`, `image`, `passwordHash`, `role`, `avatar`, `phone`, `createdAt`)
VALUES
(
'clventuredemo0000001admin',
'Admin VENTURE',
'admin@venture.demo',
NULL,
NULL,
'$2b$12$5RnoBG0KNEapurbGBPHFWuDz2I7lEL85x7TkHaoTGWlZiJJ6D/pIu',
'ADMIN',
NULL,
'+33 1 00 00 00 01',
NOW()
),
(
'clventuredemo0000002agent',
'Camille Agent',
'agent@venture.demo',
NULL,
NULL,
'$2b$12$5RnoBG0KNEapurbGBPHFWuDz2I7lEL85x7TkHaoTGWlZiJJ6D/pIu',
'AGENT',
NULL,
'+33 6 12 34 56 78',
NOW()
),
(
'clventuredemo0000003visit',
'Lucie Visiteuse',
'user@venture.demo',
NULL,
NULL,
'$2b$12$5RnoBG0KNEapurbGBPHFWuDz2I7lEL85x7TkHaoTGWlZiJJ6D/pIu',
'USER',
NULL,
NULL,
NOW()
);

INSERT INTO `Property`
(`id`, `title`, `description`, `price`, `surface`, `rooms`, `bedrooms`,
`address`, `city`, `postalCode`, `latitude`, `longitude`,
`type`, `status`, `images`, `viewCount`, `contactCount`,
`userId`, `createdAt`, `updatedAt`)
VALUES
(
'clventuredemo0000004prop1',
'Maison contemporaine avec terrasse',
'Lumineuse maison récente, grandes baies vitrées, cuisine ouverte, garage double.',
685000,
165,
6,
4,
'12 rue des Acacias',
'Lyon',
'69006',
45.7696,
4.8344,
'SALE',
'PUBLISHED',
'["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80"]',
120,
5,
'clventuredemo0000002agent',
NOW(),
NOW()
),
(
'clventuredemo0000005prop2',
'Appartement haussmannien vue dégagée',
'Parquet chevron, moulures, 3 chambres.',
920000,
118,
5,
3,
'48 boulevard Saint-Germain',
'Paris',
'75005',
48.8499,
2.343,
'SALE',
'PUBLISHED',
'["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80"]',
200,
8,
'clventuredemo0000002agent',
NOW(),
NOW()
);

INSERT INTO `Favorite`
(`id`, `userId`, `propertyId`, `createdAt`)
VALUES
(
'clventuredemo0000008fav01',
'clventuredemo0000001admin',
'clventuredemo0000004prop1',
NOW()
);