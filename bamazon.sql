CREATE DATABASE bamazon;

/*Table structure for table `departments` */

DROP TABLE IF EXISTS `departments`;

CREATE TABLE departments (
  `department_id` int(11) NOT NULL AUTO_INCREMENT,
  `department_name` varchar(50) NOT NULL,
  `over_head_costs` decimal(10,2) NOT NULL,
  `total_sales` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`department_id`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

/*Data for the table `departments` */

insert  into `departments`(`department_id`,`department_name`,`over_head_costs`,`total_sales`) values (1,'Clothing','617.50','760.00'),(2,'Electronics','7900.00','8500.00'),(3,'Games','2400.00','250.00'),(4,'Home','450.00','480.00'),(5,'Movies','75.00','90.00'),(6,'Office','520.00','600.00'),(7,'Sports','64.00','10.00'),(8,'Furniture','3600.00','4500.00'),(9,'Pets','250.00','40.00');

/*Table structure for table `products` */

DROP TABLE IF EXISTS `products`;

CREATE TABLE products (
  `item_id` int(11) NOT NULL AUTO_INCREMENT,
  `product_name` varchar(100) NOT NULL,
  `department_name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock_quantity` int(11) NOT NULL,
  `product_sales` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`item_id`)
) ENGINE=MyISAM AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;

/*Data for the table `products` */

insert  into products(`item_id`,`product_name`,`department_name`,`price`,`stock_quantity`,`product_sales`) values (1,'Shirt','Clothing','20.00',6,'140.00'),(2,'Pents','Clothing','35.00',7,'350.00'),(3,'Inception','Movies','15.00',4,'90.00'),(4,'Blender','Home','60.00',4,'240.00'),(5,'Pan','Home','30.00',6,'240.00'),(6,'TV','Electronics','1200.00',3,'4800.00'),(7,'Notebook','Electronics','950.00',2,'1900.00'),(8,'Soccer Ball','Sports','10.00',8,'10.00'),(9,'Football','Sports','12.00',5,'0.00'),(10,'PS4','Games','300.00',8,'0.00'),(11,'Xbox One','Games','250.00',6,'250.00'),(12,'Nintendo Switch','Games','300.00',5,'0.00'),(13,'Office Chair','Office','80.00',3,'400.00'),(14,'iPhone','Electronics','600.00',3,'1800.00'),(15,'Shoes','Clothing','45.00',4,'270.00'),(16,'Table','Office','100.00',5,'200.00'),(17,'Sofa','Furniture','900.00',3,'4500.00'),(18,'Bed','Furniture','1200.00',8,'0.00'),(19,'Dog Food','Pets','20.00',8,'40.00');
