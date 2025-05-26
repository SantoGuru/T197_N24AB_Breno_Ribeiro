import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import funcionariosRoutes from './routes/funcionarios.routes';
import registrosPontoRoutes from "./routes/registrosPonto.routes";
dotenv.config();

const app = express();


app.use(cors());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());

app.use('/api', funcionariosRoutes);
app.use('/api', registrosPontoRoutes);

app.listen(3333, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta 3333`);
});
