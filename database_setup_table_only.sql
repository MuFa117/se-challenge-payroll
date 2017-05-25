-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               5.6.17 - MySQL Community Server (GPL)
-- Server OS:                    Win64
-- HeidiSQL Version:             9.1.0.4867
-- --------------------------------------------------------


-- Dumping structure for table wave_payroll.hours
CREATE TABLE IF NOT EXISTS `hours` (
  `employeeID` tinyint(4) NOT NULL,
  `reportID` tinyint(4) NOT NULL,
  `trackedDate` date NOT NULL,
  `amount` float DEFAULT NULL,
  `jobGroup` char(1) DEFAULT NULL,
  PRIMARY KEY (`employeeID`,`reportID`,`trackedDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
