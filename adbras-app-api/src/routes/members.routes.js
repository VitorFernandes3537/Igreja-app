

const router = require('express').Router();
const members_controllers = require('../controllers/members.controller');

//listar membros básico, sem paginação ainda

router.get('/', members_controllers.listar);

//criar membro mínimo viável
router.post('/', members_controllers.criar);

module.exports = router;