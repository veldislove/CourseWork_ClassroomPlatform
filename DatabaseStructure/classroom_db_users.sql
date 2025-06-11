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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Антонів Володимир Ярославович','volodymyr.y.antoniv@lpnu.ua','VolodymyrAntoniv','teacher','2025-06-11 06:42:09'),(2,'Арзубов Валерій Миколайович','valerii.m.arzubov@lpnu.ua','ValeriiArzubov','teacher','2025-06-11 06:42:09'),(3,'Арзубов Максим Валерійович','maksym.v.arzubov@lpnu.ua','MaksymArzubov','teacher','2025-06-11 06:42:09'),(4,'Бадзь Вікторія Миронівна','viktoriia.m.badz@lpnu.ua','ViktoriiaBadz','teacher','2025-06-11 06:42:09'),(5,'Баран Роман Дмитрович','roman.d.baran@lpnu.ua','RomanBaran','teacher','2025-06-11 06:42:09'),(6,'Батюк Анатолій Євгенович','anatolii.e.batiuk@lpnu.ua','AnatoliiBatiuk','teacher','2025-06-11 06:42:09'),(7,'Бевз Адріян Миколайович','adriian.m.bevzz@lpnu.ua','AdriianBevz','teacher','2025-06-11 06:42:09'),(8,'Березький Олег Миколайович','oleh.m.berezkyi@lpnu.ua','OlehBerezkyi','teacher','2025-06-11 06:42:09'),(9,'Велика Оксана Миколаївна','oksana.m.velyka@lpnu.ua','OksanaVelyka','teacher','2025-06-11 06:42:09'),(10,'Вернигор Олександр Леонідович','oleksandr.l.vernyhor@lpnu.ua','OleksandrVernyhor','teacher','2025-06-11 06:42:09'),(11,'Гадьо Ірина Володимирівна','iryna.v.hadio@lpnu.ua','IrynaHadio','teacher','2025-06-11 06:42:09'),(12,'Гапич Віктор Євгенійович','viktor.e.hapych@lpnu.ua','ViktorHapych','teacher','2025-06-11 06:42:09'),(13,'Глод Сергій Ігорович','serhii.i.hlod@lpnu.ua','SerhiiHlod','teacher','2025-06-11 06:42:09'),(14,'Гривняк Андрій Ігорович','andrii.i.hryvniak@lpnu.ua','AndriiHryvniak','teacher','2025-06-11 06:42:09'),(15,'Грицик Володимир Володимирович','volodymyr.v.hrytsyk@lpnu.ua','VolodymyrHrytsyk','teacher','2025-06-11 06:42:09'),(16,'Гуракова Лілія Миколаївна','liliia.m.hurakova@lpnu.ua','LiliiaHurakova','teacher','2025-06-11 06:42:09'),(17,'Дорошенко Анастасія Володимирівна','anastasiia.v.doroshenko@lpnu.ua','AnastasiiaDoroshenko','teacher','2025-06-11 06:42:09'),(18,'Дубук Василь Іванович','vasyl.i.dubuk@lpnu.ua','VasylDubuk','teacher','2025-06-11 06:42:09'),(19,'Загвойський Ростислав Юрійович','rostyslav.y.zahvoiskyi@lpnu.ua','RostyslavZahvoiskyi','teacher','2025-06-11 06:42:09'),(20,'Зварич Віктор Ігорович','viktor.i.zvarych@lpnu.ua','ViktorZvarych','teacher','2025-06-11 06:42:09'),(21,'Зварич Ростислав Олександрович','rostyslav.o.zvarych@lpnu.ua','RostyslavZvarych','teacher','2025-06-11 06:42:09');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-11 11:10:55
