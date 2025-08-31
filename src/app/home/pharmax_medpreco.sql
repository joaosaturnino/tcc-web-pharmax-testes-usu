CREATE DATABASE  IF NOT EXISTS `pharmax` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `pharmax`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: pharmax
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `medpreco`
--

DROP TABLE IF EXISTS `medpreco`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medpreco` (
  `medpreco_id` int NOT NULL AUTO_INCREMENT,
  `farmacia_id` int NOT NULL,
  `med_id` int NOT NULL,
  `preco` decimal(10,2) NOT NULL,
  PRIMARY KEY (`medpreco_id`),
  KEY `farmacia_id` (`farmacia_id`),
  KEY `med_id` (`med_id`),
  CONSTRAINT `medpreco_ibfk_1` FOREIGN KEY (`farmacia_id`) REFERENCES `farmacia` (`farm_id`),
  CONSTRAINT `medpreco_ibfk_2` FOREIGN KEY (`med_id`) REFERENCES `medicamento` (`med_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medpreco`
--

LOCK TABLES `medpreco` WRITE;
/*!40000 ALTER TABLE `medpreco` DISABLE KEYS */;
INSERT INTO `medpreco` VALUES (1,1,1,7.98),(2,1,2,7.19),(3,1,3,21.23),(4,1,4,9.52),(5,1,5,33.58),(6,2,1,8.59),(7,2,2,9.59),(8,2,3,28.99),(9,2,4,8.59),(10,2,5,24.59),(11,3,1,5.54),(12,3,2,16.35),(13,3,3,23.36),(14,3,4,5.30),(15,3,5,28.35),(16,4,1,6.94),(17,4,2,7.33),(18,4,3,19.50),(19,4,4,7.80),(20,4,5,31.36);
/*!40000 ALTER TABLE `medpreco` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-29 13:38:40
