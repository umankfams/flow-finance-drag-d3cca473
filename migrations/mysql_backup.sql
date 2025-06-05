
-- MySQL Database Schema for Financial Tracker Backup
-- This file can be used to create a MySQL database for backup purposes

CREATE DATABASE IF NOT EXISTS financial_tracker_backup;
USE financial_tracker_backup;

-- Create categories table
CREATE TABLE categories (
  id VARCHAR(36) PRIMARY KEY,
  key_name VARCHAR(100) NOT NULL UNIQUE,
  label VARCHAR(255) NOT NULL,
  color VARCHAR(50) NOT NULL,
  icon VARCHAR(10) NOT NULL,
  type ENUM('income', 'expense') NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create transactions table
CREATE TABLE transactions (
  id VARCHAR(36) PRIMARY KEY,
  description TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  date DATE NOT NULL,
  type ENUM('income', 'expense') NOT NULL,
  category VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO categories (id, key_name, label, color, icon, type, is_default) VALUES
(UUID(), 'salary', 'Gaji', 'bg-green-500', '💼', 'income', TRUE),
(UUID(), 'investment', 'Investasi', 'bg-blue-500', '📈', 'income', TRUE),
(UUID(), 'gift', 'Hadiah', 'bg-purple-500', '🎁', 'income', TRUE),
(UUID(), 'other-income', 'Pendapatan Lain', 'bg-teal-500', '💰', 'income', TRUE),
(UUID(), 'food', 'Makanan & Minuman', 'bg-amber-500', '🍔', 'expense', TRUE),
(UUID(), 'transportation', 'Transportasi', 'bg-indigo-500', '🚗', 'expense', TRUE),
(UUID(), 'housing', 'Perumahan', 'bg-pink-500', '🏠', 'expense', TRUE),
(UUID(), 'utilities', 'Utilitas', 'bg-cyan-500', '💡', 'expense', TRUE),
(UUID(), 'entertainment', 'Hiburan', 'bg-violet-500', '🎬', 'expense', TRUE),
(UUID(), 'shopping', 'Belanja', 'bg-fuchsia-500', '🛍️', 'expense', TRUE),
(UUID(), 'health', 'Kesehatan', 'bg-rose-500', '🏥', 'expense', TRUE),
(UUID(), 'education', 'Pendidikan', 'bg-lime-500', '📚', 'expense', TRUE),
(UUID(), 'other-expense', 'Pengeluaran Lain', 'bg-slate-500', '📝', 'expense', TRUE);
