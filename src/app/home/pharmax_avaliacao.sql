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
-- Table structure for table `avaliacao`
--

DROP TABLE IF EXISTS `avaliacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `avaliacao` (
  `ava_id` int NOT NULL AUTO_INCREMENT,
  `usu_id` int NOT NULL,
  `far_id` int NOT NULL,
  `nota` tinyint DEFAULT NULL,
  `ava_comentario` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ava_id`),
  KEY `usu_id` (`usu_id`),
  KEY `far_id` (`far_id`),
  CONSTRAINT `avaliacao_ibfk_1` FOREIGN KEY (`usu_id`) REFERENCES `usuarios` (`usu_id`),
  CONSTRAINT `avaliacao_ibfk_2` FOREIGN KEY (`far_id`) REFERENCES `farmacia` (`farm_id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `avaliacao`
--

LOCK TABLES `avaliacao` WRITE;
/*!40000 ALTER TABLE `avaliacao` DISABLE KEYS */;
INSERT INTO `avaliacao` VALUES (4,3,4,10,NULL),(5,2,2,7,'testando'),(6,2,2,7,'testando a api'),(7,3,4,10,'testando a api'),(9,1,2,11,'testualizando'),(10,1,2,11,'testando a api'),(11,1,2,12,'testando a api'),(12,1,2,10,'testes na api'),(13,1,3,10,'testes na api'),(14,1,3,10,'testes na api'),(15,1,3,5,'testes na api'),(16,1,3,5,'testes na api 6456565'),(17,1,3,5,'testes na api 64565652323'),(18,1,3,5,'testes na api 64565652323'),(19,1,3,5,'testes na api 64565652323'),(20,1,3,5,'testes na api 64565652323'),(21,1,3,5,'testes na api 64565652323'),(22,1,3,5,'testes na api 64565652323'),(23,1,3,5,'testes na api 64565652323'),(24,1,3,5,'testes na api 64565652323'),(25,1,3,5,'testes na api 64565652323'),(26,1,3,5,'testes na api 64565652323'),(27,1,3,5,'testes na api 64565652323'),(28,1,3,5,'testes na api 64565652323'),(29,1,3,5,'testes na api 64565652323');
/*!40000 ALTER TABLE `avaliacao` ENABLE KEYS */;
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
