import { Router } from 'express';
import { listarFuncionarios, getFuncionarios, getFrequenciaFuncionario } from '../controllers/funcionarios.controller';

const router = Router();

router.get('/funcionarios', listarFuncionarios);
router.get('/funcionarios/mes-atual', getFuncionarios);
router.get('/frequencia', getFrequenciaFuncionario);

export default router;
