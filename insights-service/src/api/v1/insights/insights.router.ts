import { Router } from 'express';
import * as insightsController from './insights.controller';
import { authenticate } from '../../../middlewares/auth';

const insightsRouter = Router();

// Create new insight
insightsRouter.post('/', authenticate, insightsController.createInsight);

// Get specific insight by ID
insightsRouter.get('/:id', authenticate, insightsController.getInsight);

// Get all insights for authenticated user
insightsRouter.get('/user/me', authenticate, insightsController.getUserInsights);

export default insightsRouter;
