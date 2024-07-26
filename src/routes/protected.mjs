import express from "express";
import { isAuthenticated } from '../middleware/authMiddleware.mjs';

const router = express.Router();

// Example protected route
router.get('/api/protected', isAuthenticated, (req, res) => {
  res.send({ message: 'This is a protected route' });
});

export default router;