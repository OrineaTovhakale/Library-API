import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { books , Book } from '../models/Book';
import { authors } from '../models/Author';

const router = Router();

// Input validation middleware for POST and PUT
const validateBook = [
  body('title').trim().notEmpty().withMessage('Invalid Data: Title is required'),
  body('authorId').isInt().withMessage('Invalid Data: Valid authorId is required'),
  body('publicationYear').isInt({ min: 0 }).withMessage('Invalid Data: Valid publicationYear is required'),
];

// Create New Book: POST /books
router.post('/', validateBook, (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error('Invalid Data') as Error & { status?: number };
    err.status = 400;
    throw err;
  }
  const { title, authorId, publicationYear } = req.body;
  if (!authors.find(a => a.id === authorId)) {
    const err = new Error('Invalid Data: Author does not exist') as Error & { status?: number };
    err.status = 400;
    throw err;
  }
  if (books.some(b => b.title === title && b.authorId === authorId)) {
    const err = new Error('Conflict: Duplicate book for this author') as Error & { status?: number };
    err.status = 409;
    throw err;
  }
  const id = books.length + 1;
  const book: Book = { id, title, authorId, publicationYear };
  books.push(book);
  res.status(201).json(book);
});

// List All Books: GET /books
router.get('/', (req: Request, res: Response) => {
  res.status(200).json(books);
});

// Get Book By ID: GET /books/:id
router.get('/:id', (req: Request, res: Response) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) {
    const err = new Error('Not Found: Book not found') as Error & { status?: number };
    err.status = 404;
    throw err;
  }
  res.status(200).json(book);
});

// Update Book: PUT /books/:id
router.put('/:id', validateBook, (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error('Invalid Data') as Error & { status?: number };
    err.status = 400;
    throw err;
  }
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) {
    const err = new Error('Not Found: Book not found') as Error & { status?: number };
    err.status = 404;
    throw err;
  }
  const { title, authorId, publicationYear } = req.body;
  if (!authors.find(a => a.id === authorId)) {
    const err = new Error('Invalid Data: Author does not exist') as Error & { status?: number };
    err.status = 400;
    throw err;
  }
  book.title = title;
  book.authorId = authorId;
  book.publicationYear = publicationYear;
  res.status(200).json(book);
});

// Delete Book: DELETE /books/:id
router.delete('/:id', (req: Request, res: Response) => {
  const index = books.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) {
    const err = new Error('Not Found: Book not found') as Error & { status?: number };
    err.status = 404;
    throw err;
  }
  books.splice(index, 1);
  res.status(204).send();
});

export default router;