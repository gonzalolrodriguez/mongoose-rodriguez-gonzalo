import 'dotenv/config';
import express from 'express';
import { connectDB } from './src/config/database.js';
import { userRoutes } from './src/routes/user.routes.js';
import { productRoutes } from './src/routes/product.routes.js';
import { orderRoutes } from './src/routes/order.routes.js';
import { authRoutes } from './src/routes/auth.routes.js';

const app = express();


app.use(express.json());

connectDB();

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});