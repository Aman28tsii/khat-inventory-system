import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

// Handle connection events
prisma.$on('query', (e) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Query:', e.query);
    console.log('Params:', e.params);
    console.log('Duration:', e.duration, 'ms');
  }
});

prisma.$on('error', (e) => {
  console.error('Database error:', e.message);
});

export { prisma };