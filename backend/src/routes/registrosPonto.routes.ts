import { Router } from "express";
import { obterRegistrosPonto, registrarOuAtualizarPonto } from "../controllers/registrosPonto.controller";

const router = Router();

router.post("/registros-ponto", registrarOuAtualizarPonto);
router.get("/registros-ponto", obterRegistrosPonto);

export default router;