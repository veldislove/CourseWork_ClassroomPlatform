-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: classroom_db
-- ------------------------------------------------------
-- Server version	9.3.0

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
-- Table structure for table `classrooms`
--

DROP TABLE IF EXISTS `classrooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classrooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `status` enum('free','occupied') DEFAULT 'free',
  `equipment` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classrooms`
--

LOCK TABLES `classrooms` WRITE;
/*!40000 ALTER TABLE `classrooms` DISABLE KEYS */;
INSERT INTO `classrooms` VALUES (1,'801','free','Проектор, інтерактивна дошка, 25 стільців, 12 столів.'),(2,'802','occupied','Проектор, 30 стільців, магнітна дошка.'),(3,'803','free','Комп’ютерний клас: 15 ПК, проектор, 25 стільців.'),(4,'804','free','Лекційна аудиторія: проектор, дошка, 50 місць.'),(5,'805','occupied','Мультимедійна лабораторія: 10 робочих станцій, проектор, звук.'),(6,'806','free','Мала аудиторія: проектор, дошка, 20 стільців.'),(7,'807','occupied','Лабораторія фізики: спеціалізоване обладнання, 15 робочих місць.'),(8,'808','free','Проектор, інтерактивна панель, 25 стільців, кондиціонер.'),(9,'809','occupied','Аудиторія для семінарів: овальний стіл, 12 стільців, проектор.'),(10,'810','free','Лекційна аудиторія: 60 місць, 2 проектори, великий екран.'),(11,'811','occupied','Комп’ютерний клас: 20 ПК, 25 стільців, проектор, принтер.'),(12,'812','free','Аудиторія для практичних занять: дошка, 25 стільців, проектор.'),(13,'813','occupied','Переговорна кімната: круглий стіл, 8 стільців, відеоконференц-обладнання.'),(14,'814','free','Театральна аудиторія: сцена, проектор, 100 місць.'),(15,'815','occupied','Аудиторія для коворкінгу: гнучкі робочі місця, Wi-Fi, пуфи.');
/*!40000 ALTER TABLE `classrooms` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-11 11:10:54
