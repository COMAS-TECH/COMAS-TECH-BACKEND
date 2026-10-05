const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Comas TECH API',
      version: '2.0.0',
      description:
        'API del landing Comas TECH: cursos, planes de pago, inscripciones ' +
        '(Yape/Plin), subida de comprobantes, contacto, autenticacion JWT y ' +
        'panel de administracion. Los datos sensibles (documento) se guardan ' +
        'hasheados con bcrypt y nunca en texto plano.',
      contact: {
        name: 'Comas TECH',
        email: 'hola@comastech.pe',
      },
    },
    servers: [
      { url: 'http://localhost:4000/api', description: 'Servidor local' },
    ],
    tags: [
      { name: 'Auth', description: 'Registro e inicio de sesion' },
      { name: 'Cursos', description: 'Catalogo de cursos y planes' },
      { name: 'Ordenes', description: 'Inscripciones y comprobantes' },
      { name: 'Contacto', description: 'Formulario de contacto' },
      { name: 'Admin', description: 'Panel de administracion' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Pega aqui el token devuelto por /auth/login o /auth/register',
        },
      },
      schemas: {
        // ---------- AUTH ----------
        RegisterInput: {
          type: 'object',
          required: ['full_name', 'email', 'password'],
          properties: {
            full_name: { type: 'string', example: 'Maria Perez' },
            email: { type: 'string', example: 'maria@example.com' },
            password: { type: 'string', example: 'secreto123', minLength: 6 },
            phone: { type: 'string', example: '987654321' },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'maria@example.com' },
            password: { type: 'string', example: 'secreto123' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Login exitoso' },
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsIn...' },
            user: { $ref: '#/components/schemas/User' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            full_name: { type: 'string', example: 'Maria Perez' },
            email: { type: 'string', example: 'maria@example.com' },
            phone: { type: 'string', example: '987654321' },
            role: { type: 'string', enum: ['student', 'admin'], example: 'student' },
          },
        },

        // ---------- CURSOS ----------
        PaymentPlan: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            course_id: { type: 'integer', example: 1 },
            name: { type: 'string', example: '3 cuotas' },
            installments: { type: 'integer', example: 3 },
            total_amount: { type: 'number', example: 165.0 },
          },
        },
        Course: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Desarrollo Web con IA' },
            slug: { type: 'string', example: 'desarrollo-web-ia' },
            description: { type: 'string' },
            image_url: { type: 'string', example: '/images/curso-web-ia.jpg' },
            category: { type: 'string', example: 'Programacion' },
            duration_weeks: { type: 'integer', example: 8 },
            modality: { type: 'string', example: 'virtual' },
            price: { type: 'number', example: 150.0 },
            has_certification: { type: 'boolean', example: true },
            payment_plans: {
              type: 'array',
              items: { $ref: '#/components/schemas/PaymentPlan' },
            },
          },
        },

        // ---------- ORDENES ----------
        NuevaOrden: {
          type: 'object',
          required: [
            'course_id',
            'full_name',
            'email',
            'phone',
            'document_number',
            'payment_method',
          ],
          properties: {
            course_id: { type: 'integer', example: 1 },
            payment_plan_id: { type: 'integer', example: 2, nullable: true },
            full_name: { type: 'string', example: 'Maria Perez' },
            email: { type: 'string', example: 'maria@example.com' },
            phone: { type: 'string', example: '987654321' },
            document_number: {
              type: 'string',
              example: '72345678',
              description: 'DNI: se guarda hasheado con bcrypt',
            },
            payment_method: {
              type: 'string',
              enum: ['yape', 'plin'],
              example: 'yape',
            },
          },
        },
        Orden: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            user_id: { type: 'integer', example: 2 },
            course_id: { type: 'integer', example: 1 },
            payment_plan_id: { type: 'integer', example: 2, nullable: true },
            full_name: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            document_last4: { type: 'string', example: '5678' },
            payment_method: { type: 'string', enum: ['yape', 'plin'] },
            amount: { type: 'number', example: 165.0 },
            receipt_url: {
              type: 'string',
              nullable: true,
              example: '/uploads/receipt-1699999999.png',
            },
            course_image_url: {
              type: 'string',
              nullable: true,
              example: '/uploads/courses/course-1699999999.jpg',
            },
            status: {
              type: 'string',
              enum: ['pendiente', 'en_revision', 'pagado', 'rechazado'],
              example: 'pendiente',
            },
            admin_notes: { type: 'string', nullable: true },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        NuevaOrdenResponse: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            order_id: { type: 'integer', example: 12 },
            course: { type: 'string', example: 'Desarrollo Web con IA' },
            amount: { type: 'number', example: 165.0 },
            payment_method: { type: 'string', example: 'yape' },
            status: { type: 'string', example: 'pendiente' },
          },
        },

        // ---------- CONTACTO ----------
        ContactoInput: {
          type: 'object',
          required: ['name', 'email', 'message'],
          properties: {
            name: { type: 'string', example: 'Juan Lopez' },
            email: { type: 'string', example: 'juan@example.com' },
            message: {
              type: 'string',
              example: 'Quisiera mas info del curso de Redes',
            },
          },
        },

        // ---------- ADMIN ----------
        AdminStats: {
          type: 'object',
          properties: {
            total_users: { type: 'integer', example: 25 },
            total_orders: { type: 'integer', example: 42 },
            pending_orders: { type: 'integer', example: 8 },
            paid_orders: { type: 'integer', example: 30 },
            total_revenue: { type: 'number', example: 4500.0 },
          },
        },
        AdminOrderUpdate: {
          type: 'object',
          required: ['status'],
          properties: {
            status: {
              type: 'string',
              enum: ['pendiente', 'en_revision', 'pagado', 'rechazado'],
              example: 'pagado',
            },
            admin_notes: {
              type: 'string',
              nullable: true,
              example: 'Comprobante verificado correctamente',
            },
          },
        },

        // ---------- CONFIGURACION ----------
        HomeVideo: {
          type: 'object',
          properties: {
            title: { type: 'string', example: 'Conoce Comas TECH' },
            video_url: {
              type: 'string',
              nullable: true,
              example: '/uploads/home-video/home-video-1699999999.mp4',
            },
          },
        },

        // ---------- ERRORES ----------
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Error de ejemplo' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);