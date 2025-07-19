import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Payments endpoint - implementation pending' });
});

module.exports = router;
