import express from 'express';
import { connectDB } from './config/database.js';
import { userRoutes } from './routes/user.routes.js';
import { productRoutes } from './routes/product.routes.js';
import { orderRoutes } from './routes/order.routes.js';

const app = express();


app.use(express.json());

connectDB();


app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);

app.get('/', (req, res) => {
    res.send('API de E-commerce funcionando');
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});