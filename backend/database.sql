-- Create Database
CREATE DATABASE IF NOT EXISTS org_management;
USE org_management;

-- Organizations Table
CREATE TABLE IF NOT EXISTS organizations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    organization_id VARCHAR(50) UNIQUE NOT NULL,
    logo_url VARCHAR(500),
    contact VARCHAR(255),
    phone VARCHAR(20),
    alternative_phone VARCHAR(20),
    timezone VARCHAR(100) DEFAULT 'Asia/Colombo',
    region VARCHAR(100),
    language VARCHAR(50) DEFAULT 'English',
    website_url VARCHAR(500),
    max_coordinators INT DEFAULT 5,
    status ENUM('Active', 'Blocked', 'Inactive') DEFAULT 'Active',
    pending_requests INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_slug (slug)
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    organization_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Co-ordinator') NOT NULL DEFAULT 'Co-ordinator',
    status ENUM('Active', 'Co-ordinator', 'Inactive') DEFAULT 'Active',
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    INDEX idx_org_id (organization_id),
    INDEX idx_status (status)
);

-- Insert Sample Data
INSERT INTO organizations (name, slug, email, organization_id, contact, phone, pending_requests, status) VALUES
('Massachusetts Institute of Technology', 'mit', 'admin@mit.edu', '91-9876545643', 'John Smith', '+1-617-2534523', 45, 'Active'),
('GITAM Institute of Technology', 'gitam', 'gitam@gitam.in', '91-9876545643', 'Jane Doe', '+91-9347234523', 45, 'Blocked'),
('Stanford University', 'stanford', 'info@stanford.edu', '91-9876545644', 'Robert Brown', '+1-650-7234523', 45, 'Inactive');

INSERT INTO users (organization_id, name, role, status) VALUES
(1, 'Dova Richards', 'Admin', 'Active'),
(1, 'Abhishek Hari', 'Co-ordinator', 'Co-ordinator'),
(1, 'Nikita Gupta', 'Admin', 'Active'),
(2, 'John Doe', 'Admin', 'Active'),
(2, 'Sarah Wilson', 'Co-ordinator', 'Co-ordinator');