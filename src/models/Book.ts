export interface Book {
  id: number;
  title: string;
  authorId: number;
  publicationYear: number;
}

export const books: Book[] = [];