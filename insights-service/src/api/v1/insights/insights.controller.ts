import { Request, Response, NextFunction } from 'express';
import * as insightsService from './insights.service';

export const createInsight = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { prompts, brandName, brandDescription } = req.body;
    const userId = req.user?._id;

    if (!prompts || !Array.isArray(prompts) || prompts.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'prompts is required and must be a non-empty array',
      });
    }

    if (!brandName || typeof brandName !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'brandName is required and must be a string',
      });
    }

    if (!brandDescription || typeof brandDescription !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'brandDescription is required and must be a string',
      });
    }

    const insight = await insightsService.createInsight(userId!, prompts, brandName, brandDescription);

    res.status(201).json(insight);
  } catch (error: unknown) {
    next(error);
  }
};

export const getInsight = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const insight = await insightsService.getInsightById(id);

    res.status(200).json(insight);
  } catch (error: unknown) {
    next(error);
  }
};

export const getUserInsightsIDs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;

    const insights = await insightsService.getInsightsIDsByUserId(userId!);

    res.status(200).json(insights);
  } catch (error: unknown) {
    next(error);
  }
};
