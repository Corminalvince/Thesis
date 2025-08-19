CREATE TABLE `users` (
  `user_id` integer PRIMARY KEY,
  `name` varchar(255),
  `email` varchar(255) UNIQUE,
  `password_hash` varchar(255),
  `role` varchar(255),
  `contact_number` varchar(255),
  `address` text,
  `date_created` timestamp
);

CREATE TABLE `admins` (
  `admin_id` integer PRIMARY KEY,
  `user_id` integer,
  `access_level` varchar(255),
  `last_login` timestamp
);

CREATE TABLE `drivers` (
  `driver_id` integer PRIMARY KEY,
  `user_id` integer,
  `license_number` varchar(255),
  `vehicle_type` varchar(255),
  `availability_status` varchar(255),
  `last_active` timestamp
);

CREATE TABLE `food_details` (
  `food_id` integer PRIMARY KEY,
  `food_name` varchar(255),
  `food_desc` varchar(255),
  `price` double,
  `status` varchar(255)
);

CREATE TABLE `community_kitchens` (
  `kitchen_id` integer PRIMARY KEY,
  `name` varchar(255),
  `location` varchar(255),
  `contact_person` varchar(255),
  `capacity` integer
);

CREATE TABLE `food_inventory` (
  `inventory_id` integer PRIMARY KEY,
  `kitchen_id` integer,
  `food_id` integer,
  `quantity` integer,
  `unit` varchar(255),
  `expiry_date` date,
  `last_updated` timestamp
);

CREATE TABLE `food_requests` (
  `request_id` integer PRIMARY KEY,
  `user_id` integer,
  `kitchen_id` integer,
  `food_id` integer,
  `request_date` timestamp,
  `request_type` varchar(255),
  `status` varchar(255),
  `approved_by` integer
);

CREATE TABLE `deliveries` (
  `delivery_id` integer PRIMARY KEY,
  `request_id` integer,
  `donation_id` integer,
  `driver_id` integer,
  `pickup_location` varchar(255),
  `dropoff_location` varchar(255),
  `status` varchar(255),
  `delivery_time` timestamp
);

CREATE TABLE `donations` (
  `donation_id` integer PRIMARY KEY,
  `donor_id` integer,
  `date_donated` timestamp,
  `kitchen_id` integer,
  `beneficiary_id` integer,
  `admin_id` integer
);

CREATE TABLE `donation_items` (
  `donation_item_id` integer PRIMARY KEY,
  `donation_id` integer,
  `food_id` integer,
  `quantity` integer,
  `unit` varchar(255)
);

CREATE TABLE `donation_payments` (
  `payment_id` integer PRIMARY KEY,
  `donation_id` integer,
  `amount` double,
  `payment_method` varchar(255),
  `reference_number` varchar(255),
  `linked_delivery_id` integer
);

CREATE TABLE `feeds` (
  `feed_id` integer PRIMARY KEY,
  `user_id` integer,
  `post_type` varchar(255),
  `content` text,
  `date_posted` timestamp,
  `status` varchar(255)
);

CREATE TABLE `payments` (
  `payment_id` integer PRIMARY KEY,
  `user_id` integer,
  `request_id` integer,
  `delivery_id` integer,
  `amount` double,
  `payment_method` varchar(255),
  `transaction_type` varchar(255),
  `payment_status` varchar(255),
  `transaction_date` timestamp
);

CREATE TABLE `status_logs` (
  `log_id` integer PRIMARY KEY,
  `entity_type` varchar(255),
  `entity_id` integer,
  `old_status` varchar(255),
  `new_status` varchar(255),
  `notes` text,
  `changed_by` integer,
  `change_date` timestamp
);

ALTER TABLE `admins` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

ALTER TABLE `drivers` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

ALTER TABLE `food_inventory` ADD FOREIGN KEY (`kitchen_id`) REFERENCES `community_kitchens` (`kitchen_id`);

ALTER TABLE `food_inventory` ADD FOREIGN KEY (`food_id`) REFERENCES `food_details` (`food_id`);

ALTER TABLE `food_requests` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

ALTER TABLE `food_requests` ADD FOREIGN KEY (`kitchen_id`) REFERENCES `community_kitchens` (`kitchen_id`);

ALTER TABLE `food_requests` ADD FOREIGN KEY (`food_id`) REFERENCES `food_details` (`food_id`);

ALTER TABLE `food_requests` ADD FOREIGN KEY (`approved_by`) REFERENCES `admins` (`admin_id`);

ALTER TABLE `deliveries` ADD FOREIGN KEY (`request_id`) REFERENCES `food_requests` (`request_id`);

ALTER TABLE `deliveries` ADD FOREIGN KEY (`donation_id`) REFERENCES `donations` (`donation_id`);

ALTER TABLE `deliveries` ADD FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`driver_id`);

ALTER TABLE `donations` ADD FOREIGN KEY (`donor_id`) REFERENCES `users` (`user_id`);

ALTER TABLE `donations` ADD FOREIGN KEY (`kitchen_id`) REFERENCES `community_kitchens` (`kitchen_id`);

ALTER TABLE `donations` ADD FOREIGN KEY (`beneficiary_id`) REFERENCES `users` (`user_id`);

ALTER TABLE `donations` ADD FOREIGN KEY (`admin_id`) REFERENCES `admins` (`admin_id`);

ALTER TABLE `donation_items` ADD FOREIGN KEY (`donation_id`) REFERENCES `donations` (`donation_id`);

ALTER TABLE `donation_items` ADD FOREIGN KEY (`food_id`) REFERENCES `food_details` (`food_id`);

ALTER TABLE `donation_payments` ADD FOREIGN KEY (`donation_id`) REFERENCES `donations` (`donation_id`);

ALTER TABLE `donation_payments` ADD FOREIGN KEY (`linked_delivery_id`) REFERENCES `deliveries` (`delivery_id`);

ALTER TABLE `feeds` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

ALTER TABLE `payments` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

ALTER TABLE `payments` ADD FOREIGN KEY (`request_id`) REFERENCES `food_requests` (`request_id`);

ALTER TABLE `payments` ADD FOREIGN KEY (`delivery_id`) REFERENCES `deliveries` (`delivery_id`);

ALTER TABLE `status_logs` ADD FOREIGN KEY (`changed_by`) REFERENCES `users` (`user_id`);
