const express = require('express');
const projectController = require('../controllers/project.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

const router = express.Router();

router.use(requireAuth);

router.get('/projects', projectController.adminList);
router.post('/projects', upload.single('image'), projectController.adminCreate);
router.put('/projects/:id', upload.single('image'), projectController.adminUpdate);
router.post('/projects/:id/recheck', projectController.adminRecheck);
router.delete('/projects/:id', projectController.adminRemove);

module.exports = router;
