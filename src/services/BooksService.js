const { nanoid } = require('nanoid');
const ClientError = require('../exceptions/ClientError');
const NotFoundError = require('../exceptions/NotFoundError');

class BooksService {
  #books;

  constructor() {
    this.#books = [];
  }

  getAllBooks() {
    return this.#books;
  }

  addBook(payload) {
    const { pageCount, readPage } = payload;
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;

    const book = {
      id,
      ...payload,
      insertedAt,
      updatedAt,
      finished,
    };

    this.#books.push(book);
    return this.#books.filter((book) => book.id === id)[0].id;
  }

  getBookById(bookId) {
    const book = this.#books.filter((book) => book.id == bookId)[0];
    if (book === undefined) {
      throw new NotFoundError('Buku tidak ditemukan');
    }
    return book;
  }

  updateBookById(bookId, book) {
    const index = this.#books.findIndex((book) => book.id == bookId);
    if (index === -1) {
      throw new NotFoundError('Gagal memperbarui buku. Id tidak ditemukan');
    }

    const currentBook = this.#books[index];

    // manual validator
    if (book.readPage > currentBook) {
      // eslint-disable-next-line max-len
      throw new ClientError('Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount');
    }

    const updatedAt = new Date().toISOString();

    this.#books[index] = {
      ...currentBook,
      ...book,
      updatedAt,
    };
  }

  deleteBookById(bookId) {
    const index = this.#books.findIndex((book) => book.id == bookId);
    if (index === -1) {
      throw new NotFoundError('Buku gagal dihapus. Id tidak ditemukan');
    }
    this.#books.splice(index, 1);
  }
};

module.exports = BooksService;
