import { Request, Response } from 'express';
export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

export const handleError = (err: unknown, res: Response) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ 
      success: false,
      message: err.message 
    });
  }
  console.error(err);
  res.status(500).json({ 
    success: false,
    message: 'Internal server error' 
  });
};

// catch (err) {
//     handleError(err, res);
//   }

//throw new AppError(400, 'Cannot delete seller with active products');