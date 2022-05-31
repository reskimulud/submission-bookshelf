const Hapi = require('@hapi/hapi');
const books = require('./api/books');
const ClientError = require('./exceptions/ClientError');
const BooksService = require('./services/BooksService');
const BooksValidator = require('./validator/BooksValidator');

const init = async () => {
  const booksService = new BooksService();
  const booksValidator = new BooksValidator();

  const server = Hapi.server({
    port: 5000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: books,
    options: {
      service: booksService,
      validator: booksValidator,
    },
  });

  // extension
  server.ext('onPreResponse', (request, h) => {
    const {response} = request;

    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Local server starting at ${server.info.uri}`);
};

init();
