import { Request, Response, NextFunction } from 'express';
import { ShareService } from '../services/share.service.js';

export class ShareController {
  static async createShare(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const share = await ShareService.createShare(req.user!.id, req.params.id, req.body);
      res.status(201).json({
        success: true,
        data: { share },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getShares(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const shares = await ShareService.getSharesForProgram(req.user!.id, req.params.id);
      res.status(200).json({
        success: true,
        data: { shares },
      });
    } catch (error) {
      next(error);
    }
  }

  static async revokeShare(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await ShareService.revokeShare(req.user!.id, req.params.id, req.params.shareId);
      res.status(200).json({
        success: true,
        data: {
          message: 'Share link successfully revoked',
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getShared(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const program = await ShareService.getSharedProgram(req.params.token);
      res.status(200).json({
        success: true,
        data: { program },
      });
    } catch (error) {
      next(error);
    }
  }
}
