import { Response } from 'express';
import { validationResult } from 'express-validator';

export const handleValidationErrors = (req: any, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return true;
  }
  return false;
};

export const sendSuccess = (res: Response, data: any, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    data,
  });
};

export const sendError = (res: Response, message: string, statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    message,
  });
};
