
const { createClient } = require('@supabase/supabase-js');
const mysql = require('mysql2/promise');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://ifrjgyjmggmhtvnlyntf.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmcmpneWptZ2dtaHR2bmx5bnRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwODEwOTcsImV4cCI6MjA2NDY1NzA5N30.6PZFb8r5PvqM0QPQgqSeTnUDL-ZhHocQBcx_WN9hEhY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function exportToMySQL() {
  try {
    // MySQL connection configuration
    const mysqlConfig = {
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'financial_tracker_backup'
    };

    console.log('Connecting to MySQL...');
    const connection = await mysql.createConnection(mysqlConfig);

    // Fetch data from Supabase
    console.log('Fetching categories from Supabase...');
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*');

    if (categoriesError) throw categoriesError;

    console.log('Fetching transactions from Supabase...');
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('*');

    if (transactionsError) throw transactionsError;

    // Clear existing data
    console.log('Clearing existing MySQL data...');
    await connection.execute('DELETE FROM transactions');
    await connection.execute('DELETE FROM categories');

    // Insert categories
    console.log(`Inserting ${categories.length} categories...`);
    for (const category of categories) {
      await connection.execute(
        'INSERT INTO categories (id, key_name, label, color, icon, type, is_default, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          category.id,
          category.key,
          category.label,
          category.color,
          category.icon,
          category.type,
          category.is_default,
          category.created_at,
          category.updated_at
        ]
      );
    }

    // Insert transactions
    console.log(`Inserting ${transactions.length} transactions...`);
    for (const transaction of transactions) {
      await connection.execute(
        'INSERT INTO transactions (id, description, amount, date, type, category, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          transaction.id,
          transaction.description,
          transaction.amount,
          transaction.date,
          transaction.type,
          transaction.category,
          transaction.created_at,
          transaction.updated_at
        ]
      );
    }

    await connection.end();
    console.log('Export to MySQL completed successfully!');
    console.log(`Exported ${categories.length} categories and ${transactions.length} transactions.`);

  } catch (error) {
    console.error('Export failed:', error);
    process.exit(1);
  }
}

exportToMySQL();
