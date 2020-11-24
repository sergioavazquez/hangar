const CONFIG = require('../config/config');

const docs = () => {
  return {
    openapi: '3.0.0',
    info: {
      description: CONFIG.getApp('description'),
      version: CONFIG.getApp('version'),
      title: CONFIG.getApp('name'),
      termsOfService: '',
      contact: {
        email: CONFIG.getApp('contact_email'),
      },
      license: {
        name: CONFIG.getApp('license'),
        url: CONFIG.getApp('license_url'),
      },
    },
    servers: [
      {
        url: '{protocol}://0.0.0.0:4000/v1/',
        variables: {
          protocol: {
            enum: ['http', 'https'],
            default: 'http',
          },
        },
      },
      {
        url: `{protocol}://${CONFIG.app_domain}/v1/`,
        variables: {
          protocol: {
            enum: ['http', 'https'],
            default: 'https',
          },
        },
      },
    ],
    tags: [
      {
        name: 'note',
        description: 'Operations with notes',
      },
      {
        name: 'user',
        description: 'Operations about users',
      },
    ],
    paths: {
      '/notes': {
        post: {
          tags: ['note'],
          summary: 'Add a new note',
          description: '',
          operationId: 'addNote',
          consumes: ['application/json'],
          produces: ['application/json'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Note',
                },
                example: {
                  title: 'Note title!',
                  body: 'Created from swagger',
                },
              },
            },
          },
          responses: {
            201: {
              $ref: '#/components/responses/Created',
            },
            401: {
              $ref: '#/components/responses/Unauthorized',
            },
          },
          security: [
            {
              bearerAuth: [],
            },
          ],
        },
        get: {
          tags: ['note'],
          summary: 'Fetch all user notes',
          description: 'Fetch all user notes',
          operationId: 'getAllNotes',
          consumes: ['application/json'],
          produces: ['application/json'],
          responses: {
            401: {
              $ref: '#/components/responses/Unauthorized',
            },
            200: {
              description: 'Success',
            },
          },
          security: [
            {
              bearerAuth: [],
            },
          ],
        },
      },
      '/notes/{noteId}': {
        get: {
          tags: ['note'],
          summary: 'Find note by ID',
          description: 'Returns a single note',
          operationId: 'getNoteById',
          produces: ['application/json'],
          parameters: [
            {
              name: 'noteId',
              in: 'path',
              description: 'ID of note to fetch',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'successful operation',
              schema: {
                $ref: '#/components/schemas/Note',
              },
            },
            401: {
              $ref: '#/components/responses/Unauthorized',
            },
            404: {
              description: 'Note not found',
            },
          },
          security: [
            {
              bearerAuth: [],
            },
          ],
        },
        put: {
          tags: ['note'],
          summary: 'Update note with ID',
          description: 'Updates a single note',
          operationId: 'updateNoteById',
          produces: ['application/json'],
          parameters: [
            {
              name: 'noteId',
              in: 'path',
              description: 'ID of note to update',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'successful operation',
              schema: {
                $ref: '#/components/schemas/Note',
              },
            },
            401: {
              $ref: '#/components/responses/Unauthorized',
            },
            404: {
              description: 'Note not found',
            },
          },
          security: [
            {
              bearerAuth: [],
            },
          ],
        },
        delete: {
          tags: ['note'],
          summary: 'Delete note by ID',
          description: 'Deletes a single note',
          operationId: 'deleteNoteById',
          produces: ['application/json'],
          parameters: [
            {
              name: 'noteId',
              in: 'path',
              description: 'ID of note to delete',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            204: {
              $ref: '#/components/responses/NoContent',
            },
            401: {
              $ref: '#/components/responses/Unauthorized',
            },
            404: {
              description: 'Note not found',
            },
          },
          security: [
            {
              bearerAuth: [],
            },
          ],
        },
      },
      '/users': {
        post: {
          tags: ['user'],
          summary: 'Create user',
          description: "This endpoint doesn't require authentication.",
          operationId: 'createUser',
          produces: ['application/json'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User',
                },
                example: {
                  first: 'user1',
                  last: 'Lastname',
                  email: 'user1@gmail.com',
                  password: '123456',
                },
              },
            },
          },
          responses: {
            201: {
              $ref: '#/components/responses/Created',
              content: {
                schema: {
                  type: 'object',
                  user: {
                    $ref: '#/components/schemas/User',
                  },
                  token: {
                    type: 'string',
                  },
                  message: {
                    type: 'string',
                  },
                  success: {
                    type: 'string',
                  },
                },
              },
            },
            422: {
              $ref: '#/components/responses/Unprocessable',
            },
          },
        },
        get: {
          tags: ['user'],
          summary: 'Fetch current user',
          description: 'Gets current user information',
          operationId: 'fetchUser',
          produces: ['application/json'],
          responses: {
            200: {
              description: 'successful operation',
              schema: {
                $ref: '#/components/schemas/User',
              },
            },
            401: {
              $ref: '#/components/responses/Unauthorized',
            },
          },
          security: [
            {
              bearerAuth: [],
            },
          ],
        },
        put: {
          tags: ['user'],
          summary: 'Updated user',
          description: 'Update current user info',
          operationId: 'updateUser',
          produces: ['application/json'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User',
                },
                example: {
                  email: 'user1@gmail.com',
                  password: '123456',
                  first: 'Updated',
                  last: 'User',
                  phone: '23443565',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successful response',
              schema: {
                $ref: '#/components/schemas/User',
              },
            },
            422: {
              $ref: '#/components/responses/Unprocessable',
            },
            401: {
              $ref: '#/components/responses/Unauthorized',
            },
          },
          security: [
            {
              bearerAuth: [],
            },
          ],
        },
        delete: {
          tags: ['user'],
          summary: 'Delete user',
          description: 'This can only be done by the current user.',
          operationId: 'deleteUser',
          produces: ['application/json'],
          responses: {
            400: {
              description: 'Something went wrong.',
            },
            401: {
              $ref: '#/components/responses/Unauthorized',
            },
            204: {
              $ref: '#/components/responses/NoContent',
            },
          },
          security: [
            {
              bearerAuth: [],
            },
          ],
        },
      },
      '/users/login': {
        post: {
          tags: ['user'],
          summary: 'Logs user into the system',
          description: 'Retrieves Bearer token',
          operationId: 'loginUser',
          produces: ['application/json'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/login',
                },
                example: {
                  email: 'user1@gmail.com',
                  password: '123456',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'successful operation',
              schema: {
                type: 'string',
              },
              headers: {
                'content-type': {
                  type: 'string',
                  format: 'application/json',
                },
                charset: {
                  type: 'string',
                  format: 'utf-8',
                },
              },
            },
            422: {
              description: 'Failed operation.',
            },
          },
        },
      },
      '/users/logout': {
        get: {
          tags: ['user'],
          summary: 'Logs out current logged in user session',
          description: '',
          operationId: 'logoutUser',
          produces: ['application/json'],
          parameters: [],
          responses: {
            default: {
              description: 'successful operation',
            },
          },
        },
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Note: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
            },
            body: {
              type: 'string',
            },
          },
        },
        User: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            first: {
              type: 'string',
            },
            last: {
              type: 'string',
            },
            email: {
              type: 'string',
            },
            password: {
              type: 'string',
            },
            phone: {
              type: 'string',
            },
          },
        },
        login: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
            },
            password: {
              type: 'string',
            },
          },
        },
      },
      responses: {
        Unauthorized: {
          description: 'Access token is missing or invalid.',
        },
        LoginFailed: {
          description: 'User and/or pass are not valid.',
        },
        Created: {
          description: 'Resource was created.',
        },
        Unprocessable: {
          description: "This action can't be processed.",
        },
        NoContent: {
          description: 'Succcess. No content in response.',
        },
      },
    },
  };
};

module.exports = docs();
