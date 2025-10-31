import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

type Locale = 'en' | 'sw';

@Injectable()
export class I18nService {
  private cache = new Map<Locale, Record<string, unknown>>();

  getLocale(locale: Locale) {
    if (!this.cache.has(locale)) {
      const filePath = join(
        __dirname,
        'locales',
        `${locale}.json`,
      );
      const file = readFileSync(filePath, 'utf-8');
      this.cache.set(locale, JSON.parse(file));
    }
    return this.cache.get(locale);
  }
}
