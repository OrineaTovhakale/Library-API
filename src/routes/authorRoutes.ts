import { Router, Request, Response } from 'express';
import { authors, Author } from '../models/Author';
import { books } from '../models/Book';

// Define CustomError type for error handling
type CustomError = Error & { status?: number };

const router = Router();

// Create New Author: POST /authors
router.post('/', (req: Request, res: Response) => {
  const { name, birthYear } = req.body;
  if (!name || typeof birthYear !== 'number') {
    const err = new Error('Invalid Data: Name and birthYear are required') as CustomError;
    err.status = 400;
    throw err;
  }
  const id = authors.length + 1;
  const author: Author = { id, name, birthYear };
  authors.push(author);
  res.status(201).json(author);
});

// List All Authors: GET /authors
router.get('/', (req: Request, res: Response) => {
  res.status(200).json(authors);
});

// Get Author By ID: GET /authors/:id
router.get('/:id', (req: Request, res: Response) => {
  const author = authors.find(a => a.id === parseInt(req.params.id));
  if (!author) {
    const err = new Error('Not Found: Author not found') as CustomError;
    err.status = 404;
    throw err;
  }
  res.status(200).json(author);
});

// Update Author: PUT /authors/:id
router.put('/:id', (req: Request, res: Response) => {
  const author = authors.find(a => a.id === parseInt(req.params.id));
  if (!author) {
    const err = new Error('Not Found: Author not found') as CustomError;
    err.status = 404;
    throw err;
  }
  const { name, birthYear } = req.body;
  if (!name || typeof birthYear !== 'number') {
    const err = new Error('Invalid Data: Name and birthYear are required') as CustomError;
    err.status = 400;
    throw err;
  }
  author.name = name;
  author.birthYear = birthYear;
  res.status(200).json(author);
});

/// Delete Author: DELETE /authors/:id
router.delete('/:id', (req: Request, res: Response) => {
  const index = authors.findIndex(a => a.id === parseInt(req.params.id));
  if (index === -1) {
    const err = new Error('Not Found: Author not found') as CustomError;
    err.status = 404;
    throw err;
  }
  if (books.some(b => b.authorId === parseInt(req.params.id))) {
    const err = new Error('Conflict: Cannot delete author with associated books') as CustomError;
    err.status = 409;
    throw err;
  }
  authors.splice(index, 1);
  res.status(204).send();
});

router.get('/:id/books', (req: Request, res: Response) => {
  const authorId = parseInt(req.params.id);
  const author = authors.find(a => a.id === authorId);
  if (!author) {
    const err = new Error('Not Found: Author not found') as CustomError;
    err.status = 404;
    throw err;
  }
  const authorBooks = books.filter(b => b.authorId === authorId);
  res.status(200).json(authorBooks);
});

export default router;