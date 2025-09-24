# Library API

A RESTful API for managing a library system with Authors and Books.

## Setup
1. Install dependencies: `npm install`
2. Build: `npm run build`
3. Run: `npm start` or `npm run dev` for development.

The server runs on `http://localhost:3000`.

## Features
- CRUD for Authors and Books.
- Books must reference a valid author.
- Validation for invalid entries (e.g., missing fields, invalid author).
- Error handling for 400 (Invalid Data), 404 (Not Found), 409 (Conflict).
- Logger for method and URL.
- List books by author.
- Advanced queries on books: filtering (by title, author name, year), searching, sorting (by title/publicationYear, asc/desc with -prefix), pagination (?page=1&limit=10).

## Endpoints

### Authors
- **POST /authors**: Add new author.
  - Body: `{ "name": "Jane Doe", "birthYear": 1970 }`
  - Response: 201 with author, or 400 for invalid data.
- **GET /authors**: List all authors.
  - Response: 200 with array.
- **GET /authors/:id**: Get author by ID.
  - Response: 200 with author, or 404.
- **PUT /authors/:id**: Update author.
  - Body: `{ "name": "Updated Name", "birthYear": 1980 }`
  - Response: 200 with updated, or 400/404.
- **DELETE /authors/:id**: Delete author.
  - Response: 204, or 404.
- **GET /authors/:id/books**: List books by author.
  - Response: 200 with books array, or 404.

### Books
- **POST /books**: Add new book.
  - Body: `{ "title": "Book Title", "authorId": 1, "publicationYear": 2020 }`
  - Response: 201 with book, or 400 (invalid/missing author), 409 (duplicate).
- **GET /books**: List all books with queries.
  - Query params: ?title=substring&author=nameSubstring&year=2020&sort=title (or -title for desc)&page=1&limit=10
  - Response: 200 with { total, page, limit, books }.
- **GET /books/:id**: Get book by ID.
  - Response: 200 with book, or 404.
- **PUT /books/:id**: Update book.
  - Body: same as POST.
  - Response: 200 with updated, or 400/404.
- **DELETE /books/:id**: Delete book.
  - Response: 204, or 404.

## Testing with Postman
1. Start the server: `npm run dev`.
2. Use Postman to send requests (e.g., POST to /authors with JSON body).
3. Test invalid cases: e.g., POST /books without authorId → 400.
4. Test duplicates: Create same book twice → 409.
5. Test queries: GET /books?title=Book&sort=-publicationYear&page=1&limit=5.
6. Check console for logger output.
7. Test relationships: Create author, add books, GET /authors/:id/books.