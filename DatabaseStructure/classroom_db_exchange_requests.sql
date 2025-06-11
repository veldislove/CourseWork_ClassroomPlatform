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
-- Table structure for table `exchange_requests`
--

DROP TABLE IF EXISTS `exchange_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exchange_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `classroom_id` int NOT NULL,
  `subject_id` int DEFAULT NULL,
  `studentgroup_id` int DEFAULT NULL,
  `teacher_id` int DEFAULT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `status` varchar(20) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_exchange_request_classroom` (`classroom_id`),
  KEY `fk_exchange_request_subject` (`subject_id`),
  KEY `fk_exchange_request_studentgroup` (`studentgroup_id`),
  KEY `fk_exchange_request_teacher` (`teacher_id`),
  CONSTRAINT `fk_exchange_request_classroom` FOREIGN KEY (`classroom_id`) REFERENCES `classrooms` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_exchange_request_studentgroup` FOREIGN KEY (`studentgroup_id`) REFERENCES `student_groups` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_exchange_request_subject` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_exchange_request_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exchange_requests`
--

LOCK TABLES `exchange_requests` WRITE;
/*!40000 ALTER TABLE `exchange_requests` DISABLE KEYS */;
INSERT INTO `exchange_requests` VALUES (1,1,3,1,1,'2025-07-25 15:47:34','2025-07-25 16:40:48','pending','2025-06-11 10:07:58'),(2,3,3,6,4,'2025-08-16 11:15:23','2025-08-16 12:59:08','approved','2025-06-11 10:07:58'),(3,2,4,5,2,'2025-07-11 10:29:10','2025-07-11 11:47:30','rejected','2025-06-11 10:07:58'),(4,2,2,1,2,'2025-08-03 09:55:01','2025-08-03 11:23:44','approved','2025-06-11 10:07:58'),(5,4,1,3,3,'2025-08-20 14:11:50','2025-08-20 15:51:30','pending','2025-06-11 10:07:58'),(6,3,2,2,1,'2025-07-06 08:35:15','2025-07-06 09:39:20','approved','2025-06-11 10:07:58'),(7,3,1,3,3,'2025-07-31 16:03:22','2025-07-31 17:09:45','rejected','2025-06-11 10:07:58'),(8,2,1,3,3,'2025-07-18 13:20:05','2025-07-18 14:45:00','pending','2025-06-11 10:07:58'),(9,2,2,3,2,'2025-08-09 10:07:40','2025-08-09 11:15:00','pending','2025-06-11 10:07:58'),(10,1,4,2,2,'2025-08-24 12:59:10','2025-08-24 14:05:30','approved','2025-06-11 10:07:58'),(11,3,3,5,2,'2025-07-02 09:18:25','2025-07-02 10:29:40','rejected','2025-06-11 10:07:58'),(12,3,1,6,4,'2025-07-29 11:30:00','2025-07-29 12:45:15','pending','2025-06-11 10:07:58'),(13,2,3,5,1,'2025-08-11 14:00:00','2025-08-11 15:10:00','pending','2025-06-11 10:07:58'),(14,2,3,6,2,'2025-07-15 09:40:00','2025-07-15 10:55:00','approved','2025-06-11 10:07:58'),(15,2,1,2,4,'2025-08-05 16:10:00','2025-08-05 17:20:00','rejected','2025-06-11 10:07:58'),(16,3,4,3,1,'2025-07-22 10:00:00','2025-07-22 11:15:00','approved','2025-06-11 10:07:58'),(17,2,3,2,1,'2025-08-18 13:00:00','2025-08-18 14:05:00','approved','2025-06-11 10:07:58'),(18,2,1,6,4,'2025-07-08 08:00:00','2025-07-08 09:20:00','approved','2025-06-11 10:07:58'),(19,2,4,6,3,'2025-08-27 15:00:00','2025-08-27 16:30:00','rejected','2025-06-11 10:07:58'),(20,3,2,2,4,'2025-07-04 12:00:00','2025-07-04 13:10:00','rejected','2025-06-11 10:07:58'),(21,1,1,2,17,'2025-06-11 07:50:00','2025-06-11 08:50:00','pending','2025-06-11 07:50:53');
/*!40000 ALTER TABLE `exchange_requests` ENABLE KEYS */;
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
