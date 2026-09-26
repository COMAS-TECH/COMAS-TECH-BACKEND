const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Comas TECH API',
      version: '1.0.0',
      description:
        'API para el landing de Comas TECH: cursos, planes de pago, matriculas (ordenes) y contacto. ' +
        'No requiere login: la inscripcion se hace como invitado y los datos sensibles se guardan hasheados.',
    },
    servers: [
      { url: 'http://localhost:4000/api', description: 'Servidor local' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
