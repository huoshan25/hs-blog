import {knife4jSetup} from 'nestjs-knife4j';
import {writeFileSync} from 'node:fs';

import {INestApplication} from '@nestjs/common';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';

/**
 * 生成 Swagger 文档
 * @param app
 */
export const generateSwaggerDocument = (app: INestApplication) => {
  // 基础配置
  const config = new DocumentBuilder()
    .setTitle('hs blog API')
    .setDescription('hs blog 项目 API 文档')
    .setVersion('1.0.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      description: '请输入 JWT 格式的 Token',
      in: 'header',
    })
    .setContact(
      '火山',
      'https://github.com/huoshan25/sky-hub',
      '2633057734@qq.com',
    )
    .build();

  /**创建完整文档*/
  const fullDocument = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });

  /*手动筛选前台和后台的路径*/
  const webDocument = JSON.parse(JSON.stringify(fullDocument));
  const adminDocument = JSON.parse(JSON.stringify(fullDocument));

  /*筛选前台路径*/
  webDocument.paths = Object.entries(webDocument.paths).reduce(
    (acc, [path, methods]) => {
      const isWebPath =
        path.startsWith('/web/') ||
        Object.values(methods).some(
          (method) =>
            method.tags &&
            method.tags.some((tag) => tag.toLowerCase().includes('web')),
        );

      if (isWebPath) {
        acc[path] = methods;
      }
      return acc;
    },
    {},
  );

  /*筛选后台路径*/
  adminDocument.paths = Object.entries(adminDocument.paths).reduce(
    (acc, [path, methods]) => {
      const isAdminPath =
        path.startsWith('/admin/') ||
        Object.values(methods).some(
          (method) =>
            method.tags &&
            method.tags.some((tag) => tag.toLowerCase().includes('admin')),
        );

      if (isAdminPath) {
        acc[path] = methods;
      }
      return acc;
    },
    {},
  );

  /*设置 Swagger UI 路由*/
  SwaggerModule.setup('web-api-docs', app, webDocument, {
    customSiteTitle: 'HsBlog 前台 API 文档',
    customfavIcon: '/static/favicon.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  SwaggerModule.setup('admin-api-docs', app, adminDocument, {
    customSiteTitle: 'HsBlog 后台 API 文档',
    customfavIcon: '/static/favicon.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  /*保存 OpenAPI JSON 文件*/
  writeFileSync('./web-openapi.json', JSON.stringify(webDocument));
  writeFileSync('./admin-openapi.json', JSON.stringify(adminDocument));

  /*设置 Knife4j*/
  knife4jSetup(app, {
    urls: [
      {
        name: '前台 API',
        url: `/web-api-docs-json`,
        swaggerVersion: '3.0',
        location: `/web-api-docs-json`,
      },
      {
        name: '后台 API',
        url: `/admin-api-docs-json`,
        swaggerVersion: '3.0',
        location: `/admin-api-docs-json`,
      },
    ],
  });
};
