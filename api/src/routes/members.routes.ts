import { Router } from 'express';
import membersController from '@/controllers/members.controller';

const router = Router();

// listar membros básico, sem paginação ainda
router.get('/', membersController.listar);

// criar membro mínimo viável
router.post('/', membersController.criar);

export default router;
