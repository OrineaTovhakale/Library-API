import express, { Request, Response, NextFunction } from 'express';
import winston from 'winston';
import authorRoutes from './routes/authorRoutes';
import bookRoutes from './routes/bookRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = 3000;

// Logger middleware: logs method & URL
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()]
});

app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use('/authors', authorRoutes);
app.use('/books', bookRoutes);

// Centralized error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});