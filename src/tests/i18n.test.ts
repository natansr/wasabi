import { describe, expect, it } from 'vitest';
import enUS from '../i18n/locales/en-US.json';
import ptBR from '../i18n/locales/pt-BR.json';

describe('translation resources', () => {
  it('provides the principal interface sections in both languages', () => {
    for (const resource of [ptBR, enUS]) {
      expect(resource.app.name).toBe('Wasabi');
      expect(resource.home.newProject).toBeTruthy();
      expect(resource.temac.stage.preparation).toBeTruthy();
      expect(resource.privacy.localProcessing).toBeTruthy();
      expect(resource.settings.title).toBeTruthy();
      expect(resource.settings.clearData).toBeTruthy();
    }
  });
});
