class BooksHandler {
  #service;
  #valiator;

  constructor(service, validator) {
    this.#service = service;
    this.#valiator = validator;

    this.getAllBooksHandler = this.getAllBooksHandler.bind(this);
    this.postBookHandler = this.postBookHandler.bind(this);
    this.getBookByIdHandler = this.getBookByIdHandler.bind(this);
    this.putBookHandler = this.putBookHandler.bind(this);
    this.deleteBookByIdHandler = this.deleteBookByIdHandler.bind(this);
  }

  getAllBooksHandler(request) {
    const { name, finished, reading } = request.query;
    let bookFiltered = this.#service.getAllBooks();

    if (name !== undefined) {
      bookFiltered = bookFiltered.filter((book) => (
        book.name.toLowerCase().includes(name.toLowerCase())
      ));
    }

    if (finished !== undefined) {
      bookFiltered = bookFiltered.filter((book) => (
        book.finished === Boolean(Number(finished))
      ));
    }

    if (reading !== undefined) {
      bookFiltered = bookFiltered.filter((book) => (
        book.reading === Boolean(Number(reading))
      ));
    }

    return {
      status: 'success',
      data: {
        books: bookFiltered.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    };
  }

  postBookHandler(request, h) {
    this.#valiator.validateBooksPayload(
        request.payload,
        'menambahkan',
    );
    const bookId = this.#service.addBook(request.payload);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId,
      },
    });
    response.code(201);
    return response;
  }

  getBookByIdHandler(request, h) {
    const { bookId } = request.params;
    const book = this.#service.getBookById(bookId);

    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  putBookHandler(request, h) {
    this.#valiator.validateBooksPayload(
        request.payload,
        'memperbarui',
    );
    const { bookId } = request.params;

    this.#service.updateBookById(bookId, request.payload);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  deleteBookByIdHandler(request, h) {
    const { bookId } = request.params;

    this.#service.deleteBookById(bookId);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
}

module.exports = BooksHandler;
