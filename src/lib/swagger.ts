import { createSwaggerSpec } from 'next-swagger-doc'
import { APP_RELEASE_VERSION } from 'src/types/constants'

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: 'src/pages/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Safha Frontend API',
        version: APP_RELEASE_VERSION
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      },
      security: []
    }
  })

  return spec
}
