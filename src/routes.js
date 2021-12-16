const {
  getAllBooksHandler,
  addNewBookHandler,
  getBookByIdHandler,
  updateNewBookHandler,
  deleteBookByIdHandler,
} = require('./handler')

const routes = [
  {
    method: '*',
    path: '/{any*}',
    handler: (request, h) => {
      const response = h.response({
        status: 'fail',
        message: 'Halaman yang Anda minta tidak ditmukan!',
      })
      response.code(404)
      return response
    },
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler,
  },
  {
    method: 'POST',
    path: '/books',
    handler: addNewBookHandler,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookByIdHandler,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: updateNewBookHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookByIdHandler,
  },
]

module.exports = routes
