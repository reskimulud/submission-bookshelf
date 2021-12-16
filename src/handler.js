const { nanoid } = require('nanoid')
const books = require('./books')

const getAllBooksHandler = (request, h) => {
  const { name, finished, reading } = request.query
  let bookFiltered = books

  if (name !== undefined) {
    bookFiltered = books.filter((book) => (
      book.name.toLowerCase().includes(name.toLowerCase())
    ))
  }

  if (finished !== undefined) {
    bookFiltered = books.filter((book) => (
      book.finished === Boolean(Number(finished))
    ))
  }

  if (reading !== undefined) {
    bookFiltered = books.filter((book) => (
      book.reading === Boolean(Number(reading))
    ))
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
  }
}

const addNewBookHandler = (request, h) => {
  const { name, pageCount, readPage } = request.payload

  const id = nanoid(16)
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt
  const finished = pageCount === readPage

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    })
    response.code(400)
    return response
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      // eslint-disable-next-line max-len
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    })
    response.code(400)
    return response
  }

  const newBook = {
    id,
    ...request.payload,
    insertedAt,
    updatedAt,
    finished,
  }

  books.push(newBook)
  const isSuccess = books.filter((book) => book.id === id)

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    })
    response.code(201)
    return response
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  })
  response.code(500)
  return response
}

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params
  const book = books.filter((b) => b.id == bookId)[0]

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    }
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  })
  response.code(404)
  return response
}

const updateNewBookHandler = (request, h) => {
  const { bookId } = request.params
  const { name, readPage, pageCount } = request.payload
  const updatedAt = new Date().toISOString()

  const index = books.findIndex((book) => book.id === bookId)
  const book = books.filter((b) => b.id == bookId)[0]

  if (index !== -1) {
    if (!name) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      })
      response.code(400)
      return response
    }

    // eslint-disable-next-line max-len
    if (readPage > pageCount || readPage > book.pageCount) {
      const response = h.response({
        status: 'fail',
        // eslint-disable-next-line max-len
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      })
      response.code(400)
      return response
    }

    books[index] = {
      ...books[index],
      ...request.payload,
      updatedAt,
    }

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  })
  response.code(404)
  return response
}

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const index = books.findIndex((book) => book.id === bookId)

  if (index !== -1) {
    books.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  })
  response.code(404)
  return response
}

module.exports = {
  getAllBooksHandler,
  addNewBookHandler,
  getBookByIdHandler,
  updateNewBookHandler,
  deleteBookByIdHandler,
}
