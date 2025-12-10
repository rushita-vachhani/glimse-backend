const express = require('express');
const router = express.Router();
const commentaryController = require('../controllers/commentaryController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/commentaries:
 *   get:
 *     summary: Get all commentaries
 *     tags: [Commentaries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of commentaries
 */
router.get('/', authMiddleware, commentaryController.getAllCommentaries);

/**
 * @swagger
 * /api/commentaries:
 *   post:
 *     summary: Create new commentary
 *     tags: [Commentaries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *             properties:
 *               comment:
 *                 type: string
 *               sport:
 *                 type: string
 *     responses:
 *       201:
 *         description: Commentary created
 */
router.post('/', authMiddleware, commentaryController.createCommentary);

/**
 * @swagger
 * /api/commentaries/sport/{sport}:
 *   get:
 *     summary: Get commentaries by sport
 *     tags: [Commentaries]
 *     security:
 *       - bearerAuth: []
 */
router.get('/sport/:sport', authMiddleware, commentaryController.getCommentariesBySport);

/**
 * @swagger
 * /api/commentaries/{id}:
 *   delete:
 *     summary: Delete commentary
 *     tags: [Commentaries]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', authMiddleware, commentaryController.deleteCommentary);

module.exports = router;