const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: User login by name. If the user does not exist, it will be created.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "testuser"
 *     responses:
 *       200:
 *         description: Login success
 *       201:
 *         description: User created
 *       400:
 *         description: Enter user name
 *       500:
 *         description: Server error
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: User logout
 *     description: Ending the user session.
 */
router.post('/logout', authController.logout);

module.exports = router;
