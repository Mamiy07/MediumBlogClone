import express from 'express';
import { PrismaClient } from '@prisma/client';
import MainRoutes from "./routes/main_routes.js"// Adjust the path as needed
const app = express();
const prisma = new PrismaClient({datasourceUrl: process.env.DATABASE_URL});
app.use(express.json());
app.use('/api/v1',MainRoutes); 


app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
