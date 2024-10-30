import authorize from '../../_Autorização/middlewares/authorize';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Minha API',
      version: '1.0.0',
      description: 'Documentação da API',
    },
    servers: [
      {
        url: process.env.BASE_URL,
        description: 'Servidor de Desenvolvimento',
      },
    ],
  },
  apis: ['./src/**/*.js', './src/**/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerRouter = (app: any) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  // app.use('/docs', authorize, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default swaggerRouter;
