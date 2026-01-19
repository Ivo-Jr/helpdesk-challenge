import { describe, it, expect } from 'vitest';
import { formatDate } from '../formatters';

describe('formatDate', () => {
  it('deve formatar data ISO string corretamente', () => {
    const result = formatDate('2024-01-15T10:30:00.000Z');
    // Formato esperado: "15 de jan. de 2024" (pt-BR)
    expect(result).toMatch(/\d{2} de \w{3,4}\. de \d{4}/);
  });

  it('deve formatar data em formato de 2024', () => {
    const result = formatDate('2024-03-20T00:00:00.000Z');
    expect(result).toContain('2024');
    expect(result).toContain('20');
    expect(result).toContain('mar');
  });

  it('deve formatar data em formato de 2023', () => {
    const result = formatDate('2023-12-25T12:00:00.000Z');
    expect(result).toContain('2023');
    expect(result).toContain('25');
    expect(result).toContain('dez');
  });

  it('deve formatar data do início do ano', () => {
    const result = formatDate('2024-01-01T15:00:00.000Z');
    expect(result).toContain('2024');
    expect(result).toContain('01');
    expect(result).toContain('jan');
  });

  it('deve formatar data do fim do ano', () => {
    const result = formatDate('2024-12-31T23:59:59.999Z');
    expect(result).toContain('2024');
    expect(result).toContain('31');
    expect(result).toContain('dez');
  });

  it('deve formatar diferentes meses corretamente', () => {
    const months = [
      { date: '2024-01-15', month: 'jan' },
      { date: '2024-02-15', month: 'fev' },
      { date: '2024-03-15', month: 'mar' },
      { date: '2024-04-15', month: 'abr' },
      { date: '2024-05-15', month: 'mai' },
      { date: '2024-06-15', month: 'jun' },
      { date: '2024-07-15', month: 'jul' },
      { date: '2024-08-15', month: 'ago' },
      { date: '2024-09-15', month: 'set' },
      { date: '2024-10-15', month: 'out' },
      { date: '2024-11-15', month: 'nov' },
      { date: '2024-12-15', month: 'dez' },
    ];

    months.forEach(({ date, month }) => {
      const result = formatDate(date);
      expect(result).toContain(month);
    });
  });

  it('deve formatar data com hora ignorando a parte do tempo', () => {
    const morning = formatDate('2024-06-15T08:30:00.000Z');
    const evening = formatDate('2024-06-15T20:30:00.000Z');
    
    // Ambas devem resultar no mesmo dia formatado
    expect(morning).toContain('15');
    expect(evening).toContain('15');
  });

  it('deve usar formato pt-BR com "de" entre os componentes', () => {
    const result = formatDate('2024-05-10T15:00:00.000Z');
    // Formato: "10 de mai. de 2024" - note o ponto após o mês abreviado
    expect(result).toMatch(/\d{2} de \w+\.? de \d{4}/);
  });

  it('deve formatar datas antigas corretamente', () => {
    const result = formatDate('2020-01-01T15:00:00.000Z');
    expect(result).toContain('2020');
    expect(result).toContain('01');
  });

  it('deve formatar datas futuras corretamente', () => {
    const result = formatDate('2030-12-31T15:00:00.000Z');
    expect(result).toContain('2030');
    expect(result).toContain('31');
  });

  it('deve aceitar diferentes formatos de data ISO', () => {
    const formats = [
      '2024-06-15T10:30:00.000Z',
      '2024-06-15T10:30:00Z',
      '2024-06-15',
    ];

    formats.forEach((dateString) => {
      const result = formatDate(dateString);
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });
  });

  it('deve formatar data com dia de um dígito como dois dígitos', () => {
    const result = formatDate('2024-06-05T15:00:00.000Z');
    // Dia deve ser formatado como "05" não "5"
    expect(result).toMatch(/05/);
  });

  it('deve manter consistência no formato de saída', () => {
    const result1 = formatDate('2024-01-15T00:00:00.000Z');
    const result2 = formatDate('2024-01-15T00:00:00.000Z');
    
    expect(result1).toBe(result2);
  });

  it('deve retornar string não-vazia', () => {
    const result = formatDate('2024-06-15T00:00:00.000Z');
    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);
  });

  it('deve incluir todos os componentes: dia, mês e ano', () => {
    const result = formatDate('2024-06-15T00:00:00.000Z');
    
    // Deve ter dia (número)
    expect(result).toMatch(/\d{2}/);
    // Deve ter mês (texto)
    expect(result).toMatch(/[a-z]{3,4}/);
    // Deve ter ano (4 dígitos)
    expect(result).toMatch(/\d{4}/);
  });
});

