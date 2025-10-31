import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { I18nService } from './i18n.service';

@ApiTags('Localization')
@Controller({ path: 'i18n', version: '1' })
export class I18nController {
  constructor(private readonly i18nService: I18nService) {}

  @Get(':locale')
  getLocale(@Param('locale') locale: 'en' | 'sw') {
    return this.i18nService.getLocale(locale);
  }
}
