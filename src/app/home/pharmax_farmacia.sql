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
-- Table structure for table `farmacia`
--

DROP TABLE IF EXISTS `farmacia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `farmacia` (
  `farm_id` int NOT NULL AUTO_INCREMENT,
  `farm_nome` varchar(50) NOT NULL,
  `farm_endereco` varchar(200) NOT NULL,
  `farm_telefone` varchar(15) DEFAULT NULL,
  `farm_email` varchar(80) NOT NULL,
  `farm_senha` varchar(48) NOT NULL,
  `cnpj` char(14) NOT NULL,
  `farm_logo` varchar(255) DEFAULT NULL,
  `func_id` int DEFAULT NULL,
  `cid_id` int DEFAULT NULL,
  PRIMARY KEY (`farm_id`),
  UNIQUE KEY `cnpj` (`cnpj`),
  KEY `func_id` (`func_id`),
  KEY `cid_id` (`cid_id`),
  CONSTRAINT `farmacia_ibfk_1` FOREIGN KEY (`func_id`) REFERENCES `funcionarios` (`func_id`),
  CONSTRAINT `farmacia_ibfk_2` FOREIGN KEY (`cid_id`) REFERENCES `cidade` (`cidade_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `farmacia`
--

LOCK TABLES `farmacia` WRITE;
/*!40000 ALTER TABLE `farmacia` DISABLE KEYS */;
INSERT INTO `farmacia` VALUES (1,'teste','teste','1458635845','teste@gmail.com','456789','78945612378965','rest',1,2),(2,'Drogaria São Paulo - Tupã','Av. Tamoios, 1026 - Centro',NULL,'drogariasaopaulo@gmail.com','e10adc3949ba59abbe56e057f20f883e','61412110072814',NULL,1,3884),(3,'Farmácias Pague Menos - 1358','Rua Aimorés, 1755 - Centro',NULL,'paguemenos@gmail.com','e10adc3949ba59abbe56e057f20f883e','06626253135839',NULL,1,3884),(4,'Drogaria São Matheus','Rua Cherentes, 1505 - Tupã Mirim I',NULL,'saomatheus@gmail.com','e10adc3949ba59abbe56e057f20f883e','66767823000155',NULL,1,3884),(5,'teste','teste','12345678','teste@gmail.com','123456','12345678958241','reste',1,4);
/*!40000 ALTER TABLE `farmacia` ENABLE KEYS */;
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
