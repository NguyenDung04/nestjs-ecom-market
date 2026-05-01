/* eslint-disable @typescript-eslint/no-require-imports */

import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { basename, extname, join } from 'path';
import hbs = require('hbs');

function registerNamespacedPartials(
  partialsRootDir: string,
  namespace: string,
  logger: Logger,
): void {
  const targetDir = join(partialsRootDir, namespace);

  if (!existsSync(targetDir)) {
    logger.warn(`Không tìm thấy partial directory: ${targetDir}`);
    return;
  }

  const files = readdirSync(targetDir).filter(
    (file) => extname(file) === '.hbs',
  );

  for (const file of files) {
    const partialName = `${namespace}/${basename(file, '.hbs')}`;
    const partialPath = join(targetDir, file);
    const partialContent = readFileSync(partialPath, 'utf8');

    hbs.registerPartial(partialName, partialContent);
  }

  logger.log(`Đã register partial namespace: ${namespace}`);
}

function registerPartialsFromDirectory(
  directory: string,
  namespace: string,
  logger: Logger,
): void {
  if (!existsSync(directory)) {
    logger.warn(`Không tìm thấy partial directory: ${directory}`);
    return;
  }

  const files = readdirSync(directory).filter(
    (file) => extname(file) === '.hbs',
  );

  for (const file of files) {
    const partialName = `${namespace}/${basename(file, '.hbs')}`;
    const partialPath = join(directory, file);
    const partialContent = readFileSync(partialPath, 'utf8');

    hbs.registerPartial(partialName, partialContent);
  }

  logger.log(`Đã register partial directory: ${namespace}`);
}

export function setupViewEngine(
  app: NestExpressApplication,
  logger: Logger,
): void {
  const distViewsDir = join(__dirname, '..', 'views');
  const srcViewsDir = join(process.cwd(), 'src', 'views');

  const viewsDir = existsSync(distViewsDir) ? distViewsDir : srcViewsDir;

  const publicDir = join(process.cwd(), 'public');
  const partialsDir = join(viewsDir, 'partials');

  if (existsSync(publicDir)) {
    app.useStaticAssets(publicDir);
    logger.log(`Public directory: ${publicDir}`);
  } else {
    logger.warn(`Không tìm thấy public directory: ${publicDir}`);
  }

  app.setBaseViewsDir(viewsDir);
  app.setViewEngine('hbs');

  if (existsSync(partialsDir)) {
    hbs.registerPartials(partialsDir);

    registerNamespacedPartials(partialsDir, 'client', logger);
    registerNamespacedPartials(partialsDir, 'admin', logger);
    registerNamespacedPartials(partialsDir, 'auth', logger);
    registerNamespacedPartials(partialsDir, 'common', logger);
  } else {
    logger.warn(`Không tìm thấy partials directory: ${partialsDir}`);
  }

  registerPartialsFromDirectory(
    join(viewsDir, 'admin', 'categories', 'partials'),
    'admin/categories/partials',
    logger,
  );

  hbs.registerHelper('eq', function (a: unknown, b: unknown) {
    return a === b;
  });

  hbs.registerHelper('currentYear', function () {
    return new Date().getFullYear();
  });

  hbs.registerHelper('ne', function (a: unknown, b: unknown) {
    return a !== b;
  });

  hbs.registerHelper('or', function (a: unknown, b: unknown) {
    return Boolean(a || b);
  });

  hbs.registerHelper('and', function (a: unknown, b: unknown) {
    return Boolean(a && b);
  });

  hbs.registerHelper('inc', function (value: unknown) {
    return Number(value || 0) + 1;
  });

  hbs.registerHelper('json', function (context: unknown) {
    return JSON.stringify(context);
  });

  hbs.registerHelper('formatCurrency', function (value: unknown) {
    const numberValue = Number(value || 0);

    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(numberValue);
  });

  hbs.registerHelper('formatDate', function (value: unknown) {
    if (!value) {
      return '';
    }

    const date = new Date(value as string);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return new Intl.DateTimeFormat('vi-VN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  });

  hbs.registerHelper('orderStatusLabel', function (status: string) {
    const labels: Record<string, string> = {
      pending: 'Chờ xác nhận',
      confirmed: 'Đã xác nhận',
      preparing: 'Đang chuẩn bị',
      shipping: 'Đang giao hàng',
      completed: 'Hoàn tất',
      cancelled: 'Đã hủy',
      returned: 'Hoàn trả',
    };

    return labels[status] || status;
  });

  hbs.registerHelper('paymentStatusLabel', function (status: string) {
    const labels: Record<string, string> = {
      unpaid: 'Chưa thanh toán',
      paid: 'Đã thanh toán',
      failed: 'Thanh toán thất bại',
      refunded: 'Đã hoàn tiền',
    };

    return labels[status] || status;
  });

  logger.log(`Views directory: ${viewsDir}`);
  logger.log(`Partials directory: ${partialsDir}`);
}
