
const { createClient } = require('@supabase/supabase-js');
const mysql = require('mysql2/promise');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://ifrjgyjmggmhtvnlyntf.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmcmpneWptZ2dtaHR2bmx5bnRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwODEwOTcsImV4cCI6MjA2NDY1NzA5N30.6PZFb8r5PvqM0QPQgqSeTnUDL-ZhHocQBcx_WN9hEhY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function importFromMySQL() {
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

    // Fetch data from MySQL
    console.log('Fetching categories from MySQL...');
    const [categoriesRows] = await connection.execute('SELECT * FROM categories');

    console.log('Fetching transactions from MySQL...');
    const [transactionsRows] = await connection.execute('SELECT * FROM transactions');

    await connection.end();

    // Clear existing data in Supabase
    console.log('Clearing existing Supabase data...');
    await supabase.from('transactions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Insert categories to Supabase
    console.log(`Inserting ${categoriesRows.length} categories to Supabase...`);
    const categoriesData = categoriesRows.map(row => ({
      id: row.id,
      key: row.key_name,
      label: row.label,
      color: row.color,
      icon: row.icon,
      type: row.type,
      is_default: row.is_default,
      created_at: row.created_at,
      updated_at: row.updated_at
    }));

    const { error: categoriesError } = await supabase
      .from('categories')
      .insert(categoriesData);

    if (categoriesError) throw categoriesError;

    // Insert transactions to Supabase
    console.log(`Inserting ${transactionsRows.length} transactions to Supabase...`);
    const transactionsData = transactionsRows.map(row => ({
      id: row.id,
      description: row.description,
      amount: parseFloat(row.amount),
      date: row.date,
      type: row.type,
      category: row.category,
      created_at: row.created_at,
      updated_at: row.updated_at
    }));

    const { error: transactionsError } = await supabase
      .from('transactions')
      .insert(transactionsData);

    if (transactionsError) throw transactionsError;

    console.log('Import from MySQL completed successfully!');
    console.log(`Imported ${categoriesRows.length} categories and ${transactionsRows.length} transactions.`);

  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
}

importFromMySQL();
