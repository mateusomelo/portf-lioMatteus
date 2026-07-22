const express = require('express');
const projectController = require('../controllers/project.controller');

const router = express.Router();

router.get('/', projectController.publicList);
router.get('/:slug', projectController.publicGetBySlug);

module.exports = router;
