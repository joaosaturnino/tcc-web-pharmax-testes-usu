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
-- Table structure for table `medicamento`
--

DROP TABLE IF EXISTS `medicamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicamento` (
  `med_id` int NOT NULL AUTO_INCREMENT,
  `med_nome` varchar(60) NOT NULL,
  `med_dosagem` varchar(10) NOT NULL,
  `med_quantidade` varchar(10) NOT NULL,
  `forma_id` int NOT NULL,
  `descricao` varchar(250) DEFAULT NULL,
  `lab_id` int NOT NULL,
  `med_img` varchar(255) DEFAULT NULL,
  `tipo_id` int NOT NULL,
  PRIMARY KEY (`med_id`),
  KEY `forma_id` (`forma_id`),
  KEY `lab_id` (`lab_id`),
  KEY `tipo_id` (`tipo_id`),
  CONSTRAINT `medicamento_ibfk_1` FOREIGN KEY (`forma_id`) REFERENCES `forma_farmaceutica` (`forma_id`),
  CONSTRAINT `medicamento_ibfk_2` FOREIGN KEY (`lab_id`) REFERENCES `laboratorio` (`lab_id`),
  CONSTRAINT `medicamento_ibfk_3` FOREIGN KEY (`tipo_id`) REFERENCES `tipo_produto` (`tipo_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicamento`
--

LOCK TABLES `medicamento` WRITE;
/*!40000 ALTER TABLE `medicamento` DISABLE KEYS */;
INSERT INTO `medicamento` VALUES (1,'Neosoro','0,5mg/ml','30ml',20,NULL,1,NULL,7),(2,'Dipirona','500mg/ml','20ml',6,NULL,2,NULL,3),(3,'Dipirona','500mg','30 comp',1,NULL,3,NULL,3),(4,'Nimesulida','100mg','12 comp',1,NULL,4,NULL,6),(5,'Cetoprofeno','150mg','10 comp',1,NULL,5,NULL,7),(7,'teste','0,5mg/ml','30ml',1,NULL,1,'teste',2),(8,'teste50','0,5mg/ml','30ml',1,NULL,1,NULL,2);
/*!40000 ALTER TABLE `medicamento` ENABLE KEYS */;
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
