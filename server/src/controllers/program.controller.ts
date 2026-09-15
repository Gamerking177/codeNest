import { Request, Response, NextFunction } from 'express';
import { ProgramService } from '../services/program.service.js';
import { QueryProgramsInput } from '../schemas/program.schema.js';

export class ProgramController {
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const program = await ProgramService.createProgram(req.user!.id, req.body);
      res.status(201).json({
        success: true,
        data: { program },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = req.query as unknown as QueryProgramsInput;
      const result = await ProgramService.getPrograms(req.user!.id, query);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const program = await ProgramService.getProgramById(req.user!.id, req.params.id);
      res.status(200).json({
        success: true,
        data: { program },
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const program = await ProgramService.updateProgram(req.user!.id, req.params.id, req.body);
      res.status(200).json({
        success: true,
        data: { program },
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await ProgramService.deleteProgram(req.user!.id, req.params.id);
      res.status(200).json({
        success: true,
        data: {
          message: 'Program deleted successfully',
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async toggleFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const program = await ProgramService.toggleFavorite(req.user!.id, req.params.id);
      res.status(200).json({
        success: true,
        data: { program },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await ProgramService.getDashboardStats(req.user!.id);
      res.status(200).json({
        success: true,
        data: { stats },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSubjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const subjects = await ProgramService.getDistinctSubjects(req.user!.id);
      res.status(200).json({
        success: true,
        data: { subjects },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTags(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tags = await ProgramService.getDistinctTags(req.user!.id);
      res.status(200).json({
        success: true,
        data: { tags },
      });
    } catch (error) {
      next(error);
    }
  }
}
