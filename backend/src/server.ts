import express from 'express';
import funcionariosRoutes from './routes/funcionarios.routes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api', funcionariosRoutes);

app.listen(3333, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta 3333`);
});
