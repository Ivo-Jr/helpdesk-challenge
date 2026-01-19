import { describe, it, expect } from 'vitest';
import {
  TICKET_STATUS,
  TICKET_PRIORITY,
  TICKET_CATEGORY,
  PUBLIC_EMAIL_DOMAINS,
  STATUS_LABELS,
  PRIORITY_LABELS,
  CATEGORY_LABELS,
} from '../constants';

describe('TICKET_STATUS', () => {
  it('deve conter as chaves esperadas', () => {
    expect(TICKET_STATUS).toHaveProperty('OPEN');
    expect(TICKET_STATUS).toHaveProperty('IN_PROGRESS');
    expect(TICKET_STATUS).toHaveProperty('RESOLVED');
  });

  it('deve ter os valores corretos', () => {
    expect(TICKET_STATUS.OPEN).toBe('open');
    expect(TICKET_STATUS.IN_PROGRESS).toBe('in_progress');
    expect(TICKET_STATUS.RESOLVED).toBe('resolved');
  });

  it('deve ter exatamente 3 status', () => {
    expect(Object.keys(TICKET_STATUS)).toHaveLength(3);
  });

  it('deve ser um objeto imutável (as const)', () => {
    // TypeScript garante isso, mas podemos verificar a estrutura
    expect(typeof TICKET_STATUS).toBe('object');
  });
});

describe('TICKET_PRIORITY', () => {
  it('deve conter as chaves esperadas', () => {
    expect(TICKET_PRIORITY).toHaveProperty('LOW');
    expect(TICKET_PRIORITY).toHaveProperty('MEDIUM');
    expect(TICKET_PRIORITY).toHaveProperty('HIGH');
  });

  it('deve ter os valores corretos', () => {
    expect(TICKET_PRIORITY.LOW).toBe('low');
    expect(TICKET_PRIORITY.MEDIUM).toBe('medium');
    expect(TICKET_PRIORITY.HIGH).toBe('high');
  });

  it('deve ter exatamente 3 prioridades', () => {
    expect(Object.keys(TICKET_PRIORITY)).toHaveLength(3);
  });
});

describe('TICKET_CATEGORY', () => {
  it('deve conter as chaves esperadas', () => {
    expect(TICKET_CATEGORY).toHaveProperty('BUG');
    expect(TICKET_CATEGORY).toHaveProperty('BILLING');
    expect(TICKET_CATEGORY).toHaveProperty('FEATURE');
    expect(TICKET_CATEGORY).toHaveProperty('OTHER');
  });

  it('deve ter os valores corretos', () => {
    expect(TICKET_CATEGORY.BUG).toBe('bug');
    expect(TICKET_CATEGORY.BILLING).toBe('billing');
    expect(TICKET_CATEGORY.FEATURE).toBe('feature');
    expect(TICKET_CATEGORY.OTHER).toBe('other');
  });

  it('deve ter exatamente 4 categorias', () => {
    expect(Object.keys(TICKET_CATEGORY)).toHaveLength(4);
  });
});

describe('PUBLIC_EMAIL_DOMAINS', () => {
  it('deve ser um array', () => {
    expect(Array.isArray(PUBLIC_EMAIL_DOMAINS)).toBe(true);
  });

  it('deve conter os domínios públicos esperados', () => {
    expect(PUBLIC_EMAIL_DOMAINS).toContain('gmail.com');
    expect(PUBLIC_EMAIL_DOMAINS).toContain('hotmail.com');
    expect(PUBLIC_EMAIL_DOMAINS).toContain('yahoo.com');
    expect(PUBLIC_EMAIL_DOMAINS).toContain('outlook.com');
  });

  it('deve ter exatamente 4 domínios', () => {
    expect(PUBLIC_EMAIL_DOMAINS).toHaveLength(4);
  });

  it('todos os domínios devem ser strings', () => {
    PUBLIC_EMAIL_DOMAINS.forEach((domain) => {
      expect(typeof domain).toBe('string');
    });
  });

  it('todos os domínios devem conter ponto', () => {
    PUBLIC_EMAIL_DOMAINS.forEach((domain) => {
      expect(domain).toContain('.');
    });
  });

  it('nenhum domínio deve começar com @', () => {
    PUBLIC_EMAIL_DOMAINS.forEach((domain) => {
      expect(domain.startsWith('@')).toBe(false);
    });
  });
});

describe('STATUS_LABELS', () => {
  it('deve ser um objeto', () => {
    expect(typeof STATUS_LABELS).toBe('object');
  });

  it('deve ter labels em português para todos os status', () => {
    expect(STATUS_LABELS.open).toBe('Aberto');
    expect(STATUS_LABELS.in_progress).toBe('Em Progresso');
    expect(STATUS_LABELS.resolved).toBe('Resolvido');
  });

  it('deve ter exatamente 3 labels', () => {
    expect(Object.keys(STATUS_LABELS)).toHaveLength(3);
  });

  it('todas as labels devem ser strings não-vazias', () => {
    Object.values(STATUS_LABELS).forEach((label) => {
      expect(typeof label).toBe('string');
      expect(label.length).toBeGreaterThan(0);
    });
  });

  it('deve mapear corretamente os valores técnicos para labels', () => {
    expect(STATUS_LABELS[TICKET_STATUS.OPEN]).toBe('Aberto');
    expect(STATUS_LABELS[TICKET_STATUS.IN_PROGRESS]).toBe('Em Progresso');
    expect(STATUS_LABELS[TICKET_STATUS.RESOLVED]).toBe('Resolvido');
  });
});

describe('PRIORITY_LABELS', () => {
  it('deve ser um objeto', () => {
    expect(typeof PRIORITY_LABELS).toBe('object');
  });

  it('deve ter labels em português para todas as prioridades', () => {
    expect(PRIORITY_LABELS.low).toBe('Baixa');
    expect(PRIORITY_LABELS.medium).toBe('Média');
    expect(PRIORITY_LABELS.high).toBe('Alta');
  });

  it('deve ter exatamente 3 labels', () => {
    expect(Object.keys(PRIORITY_LABELS)).toHaveLength(3);
  });

  it('todas as labels devem ser strings não-vazias', () => {
    Object.values(PRIORITY_LABELS).forEach((label) => {
      expect(typeof label).toBe('string');
      expect(label.length).toBeGreaterThan(0);
    });
  });

  it('deve mapear corretamente os valores técnicos para labels', () => {
    expect(PRIORITY_LABELS[TICKET_PRIORITY.LOW]).toBe('Baixa');
    expect(PRIORITY_LABELS[TICKET_PRIORITY.MEDIUM]).toBe('Média');
    expect(PRIORITY_LABELS[TICKET_PRIORITY.HIGH]).toBe('Alta');
  });
});

describe('CATEGORY_LABELS', () => {
  it('deve ser um objeto', () => {
    expect(typeof CATEGORY_LABELS).toBe('object');
  });

  it('deve ter labels para todas as categorias', () => {
    expect(CATEGORY_LABELS.bug).toBe('Bug');
    expect(CATEGORY_LABELS.billing).toBe('Cobrança');
    expect(CATEGORY_LABELS.feature).toBe('Feature');
    expect(CATEGORY_LABELS.other).toBe('Outro');
  });

  it('deve ter exatamente 4 labels', () => {
    expect(Object.keys(CATEGORY_LABELS)).toHaveLength(4);
  });

  it('todas as labels devem ser strings não-vazias', () => {
    Object.values(CATEGORY_LABELS).forEach((label) => {
      expect(typeof label).toBe('string');
      expect(label.length).toBeGreaterThan(0);
    });
  });

  it('deve mapear corretamente os valores técnicos para labels', () => {
    expect(CATEGORY_LABELS[TICKET_CATEGORY.BUG]).toBe('Bug');
    expect(CATEGORY_LABELS[TICKET_CATEGORY.BILLING]).toBe('Cobrança');
    expect(CATEGORY_LABELS[TICKET_CATEGORY.FEATURE]).toBe('Feature');
    expect(CATEGORY_LABELS[TICKET_CATEGORY.OTHER]).toBe('Outro');
  });
});

describe('Integração entre constantes e labels', () => {
  it('deve haver label para cada status', () => {
    Object.values(TICKET_STATUS).forEach((status) => {
      expect(STATUS_LABELS).toHaveProperty(status);
    });
  });

  it('deve haver label para cada prioridade', () => {
    Object.values(TICKET_PRIORITY).forEach((priority) => {
      expect(PRIORITY_LABELS).toHaveProperty(priority);
    });
  });

  it('deve haver label para cada categoria', () => {
    Object.values(TICKET_CATEGORY).forEach((category) => {
      expect(CATEGORY_LABELS).toHaveProperty(category);
    });
  });
});

