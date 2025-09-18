import { Router, Request, Response } from 'express';
import { authors, Author } from '../models/Author';

const router = Router();

// Create New Author: POST /authors
router.post('/', (req: Request, res: Response) => {
  const { name, birthYear } = req.body;
  if (!name || typeof birthYear !== 'number') {
    return res.status(400).json({ error: 'Invalid Data: Name and birthYear are required' });
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
    return res.status(404).json({ error: 'Not Found: Author not found' });
  }
  res.status(200).json(author);
});

// Update Author: PUT /authors/:id
router.put('/:id', (req: Request, res: Response) => {
  const author = authors.find(a => a.id === parseInt(req.params.id));
  if (!author) {
    return res.status(404).json({ error: 'Not Found: Author not found' });
  }
  const { name, birthYear } = req.body;
  if (!name || typeof birthYear !== 'number') {
    return res.status(400).json({ error: 'Invalid Data: Name and birthYear are required' });
  }
  author.name = name;
  author.birthYear = birthYear;
  res.status(200).json(author);
});

// Delete Author: DELETE /authors/:id
router.delete('/:id', (req: Request, res: Response) => {
  const index = authors.findIndex(a => a.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Not Found: Author not found' });
  }
  authors.splice(index, 1);
  res.status(204).send();
});

export default router;