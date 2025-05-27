import { Router } from "express";
import { obterRegistrosPonto, registrarOuAtualizarPonto, removerCampoPonto } from "../controllers/registrosPonto.controller";

const router = Router();

router.post("/registros-ponto", registrarOuAtualizarPonto);
router.get("/registros-ponto", obterRegistrosPonto);
router.patch("/registros-ponto/remover-campo", removerCampoPonto);

export default router;