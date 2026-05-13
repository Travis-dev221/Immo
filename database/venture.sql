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

-- ----------------------------------------------------------------------------- User (créé en premier : référencé par les autres tables)
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `emailVerified` DATETIME(3) NULL,
    `image` VARCHAR(191) NULL,
    `passwordHash` VARCHAR(191) NULL,
    `role` ENUM('USER', 'AGENT', 'ADMIN') NOT NULL DEFAULT 'USER',
    `avatar` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,

    UNIQUE INDEX `Account_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_sessionToken_key`(`sessionToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `VerificationToken` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `VerificationToken_token_key`(`token`),
    UNIQUE INDEX `VerificationToken_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Property` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `price` DOUBLE NOT NULL,
    `surface` DOUBLE NOT NULL,
    `rooms` INTEGER NOT NULL,
    `bedrooms` INTEGER NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `postalCode` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `type` ENUM('SALE', 'RENT') NOT NULL,
    `status` ENUM('PENDING', 'PUBLISHED', 'SOLD') NOT NULL DEFAULT 'PENDING',
    `images` JSON NOT NULL DEFAULT ('[]'),
    `viewCount` INTEGER NOT NULL DEFAULT 0,
    `contactCount` INTEGER NOT NULL DEFAULT 0,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    INDEX `Property_city_idx`(`city`),
    INDEX `Property_type_status_idx`(`type`, `status`),
    INDEX `Property_latitude_longitude_idx`(`latitude`, `longitude`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Favorite` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `propertyId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Favorite_userId_propertyId_key`(`userId`, `propertyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Contact` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `propertyId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Contact_propertyId_idx`(`propertyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Property` ADD CONSTRAINT `Property_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Favorite` ADD CONSTRAINT `Favorite_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Favorite` ADD CONSTRAINT `Favorite_propertyId_fkey` FOREIGN KEY (`propertyId`) REFERENCES `Property`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Contact` ADD CONSTRAINT `Contact_propertyId_fkey` FOREIGN KEY (`propertyId`) REFERENCES `Property`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- -----------------------------------------------------------------------------
-- Données de démonstration (mot de passe partout : demo123456)
-- Hash bcrypt : $2b$12$5RnoBG0KNEapurbGBPHFWuDz2I7lEL85x7TkHaoTGWlZiJJ6D/pIu
-- -----------------------------------------------------------------------------

INSERT INTO `User` (`id`, `name`, `email`, `emailVerified`, `image`, `passwordHash`, `role`, `avatar`, `phone`, `createdAt`) VALUES
('clventuredemo0000001admin', 'Admin VENTURE', 'admin@venture.demo', NULL, NULL, '$2b$12$5RnoBG0KNEapurbGBPHFWuDz2I7lEL85x7TkHaoTGWlZiJJ6D/pIu', 'ADMIN', NULL, '+33 1 00 00 00 01', NOW(3)),
('clventuredemo0000002agent', 'Camille Agent', 'agent@venture.demo', NULL, NULL, '$2b$12$5RnoBG0KNEapurbGBPHFWuDz2I7lEL85x7TkHaoTGWlZiJJ6D/pIu', 'AGENT', NULL, '+33 6 12 34 56 78', NOW(3)),
('clventuredemo0000003visit', 'Lucie Visiteuse', 'user@venture.demo', NULL, NULL, '$2b$12$5RnoBG0KNEapurbGBPHFWuDz2I7lEL85x7TkHaoTGWlZiJJ6D/pIu', 'USER', NULL, NULL, NOW(3));

INSERT INTO `Property` (`id`, `title`, `description`, `price`, `surface`, `rooms`, `bedrooms`, `address`, `city`, `postalCode`, `latitude`, `longitude`, `type`, `status`, `images`, `viewCount`, `contactCount`, `userId`, `createdAt`, `updatedAt`) VALUES
('clventuredemo0000004prop1', 'Maison contemporaine avec terrasse', 'Lumineuse maison récente, grandes baies vitrées, cuisine ouverte, garage double. Quartier calme proche commodités.', 685000, 165, 6, 4, '12 rue des Acacias', 'Lyon', '69006', 45.7696, 4.8344, 'SALE', 'PUBLISHED', CAST('["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80"]' AS JSON), 120, 5, 'clventuredemo0000002agent', NOW(3), NOW(3)),
('clventuredemo0000005prop2', 'Appartement haussmannien vue dégagée', 'Parquet chevron, moulures, 3 chambres, cave. Immeuble bien entretenu avec digicode et interphone.', 920000, 118, 5, 3, '48 boulevard Saint-Germain', 'Paris', '75005', 48.8499, 2.343, 'SALE', 'PUBLISHED', CAST('["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80"]' AS JSON), 200, 8, 'clventuredemo0000002agent', NOW(3), NOW(3)),
('clventuredemo0000006prop3', 'T3 neuf en location — résidence services', 'Première occupation, balcon, parking sous-sol, proche tram. Charges faibles, disponible de suite.', 1250, 68, 3, 2, '5 quai Victor Augagneur', 'Lyon', '69003', 45.7485, 4.8467, 'RENT', 'PUBLISHED', CAST('["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80"]' AS JSON), 45, 2, 'clventuredemo0000002agent', NOW(3), NOW(3)),
('clventuredemo0000007prop4', 'Villa bord de mer — coup de cœur', 'Piscine chauffée, jardin paysager, accès plage à pied.', 1890000, 220, 8, 5, '33 avenue de la Méditerranée', 'Nice', '06200', 43.7102, 7.262, 'SALE', 'PENDING', CAST('["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80"]' AS JSON), 0, 0, 'clventuredemo0000002agent', NOW(3), NOW(3));

INSERT INTO `Favorite` (`id`, `userId`, `propertyId`, `createdAt`) VALUES
('clventuredemo0000008fav01', 'clventuredemo0000001admin', 'clventuredemo0000004prop1', NOW(3));
