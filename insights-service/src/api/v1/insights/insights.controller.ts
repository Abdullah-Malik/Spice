import { Request, Response, NextFunction } from 'express';
import * as insightsService from './insights.service';

export const createInsight = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { prompts } = req.body;
    const userId = req.user?._id;

    if (!prompts || !Array.isArray(prompts) || prompts.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'prompts is required and must be a non-empty array',
      });
    }

    const insight = await insightsService.createInsight(userId!, prompts);

    res.status(201).json(insight);
  } catch (error: unknown) {
    next(error);
  }
};

export const getInsight = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const insight = await insightsService.getInsightById(id);

    res.status(200).json({
      success: true,
      data: insight,
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const getUserInsights = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;

    const insights = await insightsService.getInsightsByUserId(userId!);

    res.status(200).json({
      success: true,
      data: insights,
    });
  } catch (error: unknown) {
    next(error);
  }
};
