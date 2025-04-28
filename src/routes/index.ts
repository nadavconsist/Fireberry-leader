import { Router } from 'express';
import { createContactEndpoint } from '../controllers/contactController';
// Routes

const router = Router();

router.post('/create-contact', createContactEndpoint);

export default router;
