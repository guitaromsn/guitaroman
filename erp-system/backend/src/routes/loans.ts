import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Loans endpoint - implementation pending' });
});

module.exports = router;
