import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getBaseUrl } from '../config';

describe('getBaseUrl', () => {
  beforeEach(() => {
    // Limpar todos os mocks de ambiente antes de cada teste
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    // Limpar todos os mocks de ambiente após cada teste
    vi.unstubAllEnvs();
  });

  describe('Prioridade 1: NEXT_PUBLIC_API_URL', () => {
    it('deve retornar NEXT_PUBLIC_API_URL quando definida', () => {
      vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://api.example.com');
      
      const result = getBaseUrl();
      
      expect(result).toBe('https://api.example.com');
    });

    it('deve retornar NEXT_PUBLIC_API_URL mesmo com VERCEL_URL definida', () => {
      vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://api.custom.com');
      vi.stubEnv('VERCEL_URL', 'myapp.vercel.app');
      
      const result = getBaseUrl();
      
      expect(result).toBe('https://api.custom.com');
    });

    it('deve retornar NEXT_PUBLIC_API_URL mesmo em produção', () => {
      vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://production-api.com');
      vi.stubEnv('NODE_ENV', 'production');
      
      const result = getBaseUrl();
      
      expect(result).toBe('https://production-api.com');
    });

    it('deve aceitar NEXT_PUBLIC_API_URL com http', () => {
      vi.stubEnv('NEXT_PUBLIC_API_URL', 'http://localhost:4000');
      
      const result = getBaseUrl();
      
      expect(result).toBe('http://localhost:4000');
    });

    it('deve aceitar NEXT_PUBLIC_API_URL com porta customizada', () => {
      vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://api.example.com:8080');
      
      const result = getBaseUrl();
      
      expect(result).toBe('https://api.example.com:8080');
    });
  });

  describe('Prioridade 2: VERCEL_URL', () => {
    it('deve retornar https://VERCEL_URL quando definida', () => {
      vi.stubEnv('VERCEL_URL', 'myapp-production.vercel.app');
      
      const result = getBaseUrl();
      
      expect(result).toBe('https://myapp-production.vercel.app');
    });

    it('deve adicionar https:// ao VERCEL_URL', () => {
      vi.stubEnv('VERCEL_URL', 'project-abc123.vercel.app');
      
      const result = getBaseUrl();
      
      expect(result).toContain('https://');
      expect(result).toBe('https://project-abc123.vercel.app');
    });

    it('deve usar VERCEL_URL mesmo em produção', () => {
      vi.stubEnv('VERCEL_URL', 'production.vercel.app');
      vi.stubEnv('NODE_ENV', 'production');
      
      const result = getBaseUrl();
      
      expect(result).toBe('https://production.vercel.app');
    });

    it('deve usar VERCEL_URL com subdomínios complexos', () => {
      vi.stubEnv('VERCEL_URL', 'feature-branch-abc123-team.vercel.app');
      
      const result = getBaseUrl();
      
      expect(result).toBe('https://feature-branch-abc123-team.vercel.app');
    });
  });

  describe('Prioridade 3: NODE_ENV production (sem variáveis)', () => {
    it('deve lançar erro em produção sem NEXT_PUBLIC_API_URL ou VERCEL_URL', () => {
      vi.stubEnv('NODE_ENV', 'production');
      
      expect(() => getBaseUrl()).toThrow();
    });

    it('deve lançar erro com mensagem específica em produção', () => {
      vi.stubEnv('NODE_ENV', 'production');
      
      expect(() => getBaseUrl()).toThrow(
        'NEXT_PUBLIC_API_URL não está definida em produção'
      );
    });

    it('deve lançar erro que menciona configuração de variável', () => {
      vi.stubEnv('NODE_ENV', 'production');
      
      expect(() => getBaseUrl()).toThrow('Configure a variável de ambiente');
    });
  });

  describe('Fallback: localhost (desenvolvimento)', () => {
    it('deve retornar localhost sem variáveis de ambiente', () => {
      const result = getBaseUrl();
      
      expect(result).toBe('http://localhost:3000');
    });

    it('deve retornar localhost em NODE_ENV=development', () => {
      vi.stubEnv('NODE_ENV', 'development');
      
      const result = getBaseUrl();
      
      expect(result).toBe('http://localhost:3000');
    });

    it('deve retornar localhost em NODE_ENV=test', () => {
      vi.stubEnv('NODE_ENV', 'test');
      
      const result = getBaseUrl();
      
      expect(result).toBe('http://localhost:3000');
    });

    it('deve retornar localhost sem NODE_ENV definido', () => {
      // NODE_ENV não é definido (comportamento padrão do unstubAllEnvs)
      const result = getBaseUrl();
      
      expect(result).toBe('http://localhost:3000');
    });
  });

  describe('Edge Cases e Combinações', () => {
    it('deve ignorar NEXT_PUBLIC_API_URL vazia', () => {
      vi.stubEnv('NEXT_PUBLIC_API_URL', '');
      vi.stubEnv('VERCEL_URL', 'fallback.vercel.app');
      
      const result = getBaseUrl();
      
      expect(result).toBe('https://fallback.vercel.app');
    });

    it('deve ignorar VERCEL_URL vazia e usar fallback', () => {
      vi.stubEnv('VERCEL_URL', '');
      vi.stubEnv('NODE_ENV', 'development');
      
      const result = getBaseUrl();
      
      expect(result).toBe('http://localhost:3000');
    });

    it('deve priorizar NEXT_PUBLIC_API_URL sobre todas outras opções', () => {
      vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://priority.com');
      vi.stubEnv('VERCEL_URL', 'secondary.vercel.app');
      vi.stubEnv('NODE_ENV', 'production');
      
      const result = getBaseUrl();
      
      expect(result).toBe('https://priority.com');
    });

    it('deve funcionar com VERCEL_URL contendo apenas domínio', () => {
      vi.stubEnv('VERCEL_URL', 'simple.app');
      
      const result = getBaseUrl();
      
      expect(result).toBe('https://simple.app');
    });

    it('deve retornar string não-vazia em todos os cenários válidos', () => {
      // Cenário 1: NEXT_PUBLIC_API_URL
      vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://test.com');
      expect(getBaseUrl().length).toBeGreaterThan(0);
      
      // Cenário 2: VERCEL_URL
      vi.unstubAllEnvs();
      vi.stubEnv('VERCEL_URL', 'test.vercel.app');
      expect(getBaseUrl().length).toBeGreaterThan(0);
      
      // Cenário 3: Fallback
      vi.unstubAllEnvs();
      vi.stubEnv('NODE_ENV', 'development');
      expect(getBaseUrl().length).toBeGreaterThan(0);
    });
  });

  describe('Validação de Formato', () => {
    it('deve retornar URL começando com http:// ou https://', () => {
      // Caso 1: NEXT_PUBLIC_API_URL
      vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://api.com');
      expect(getBaseUrl()).toMatch(/^https?:\/\//);
      
      // Caso 2: VERCEL_URL
      vi.unstubAllEnvs();
      vi.stubEnv('VERCEL_URL', 'app.vercel.app');
      expect(getBaseUrl()).toMatch(/^https?:\/\//);
      
      // Caso 3: Fallback
      vi.unstubAllEnvs();
      expect(getBaseUrl()).toMatch(/^https?:\/\//);
    });

    it('VERCEL_URL deve sempre resultar em https://', () => {
      vi.stubEnv('VERCEL_URL', 'any-url.vercel.app');
      
      const result = getBaseUrl();
      
      expect(result).toMatch(/^https:\/\//);
    });

    it('fallback deve sempre resultar em http://localhost:3000', () => {
      vi.stubEnv('NODE_ENV', 'development');
      
      const result = getBaseUrl();
      
      expect(result).toBe('http://localhost:3000');
      expect(result).toMatch(/^http:\/\/localhost:\d+$/);
    });
  });

  describe('Comportamento Determinístico', () => {
    it('deve retornar o mesmo valor para as mesmas variáveis', () => {
      vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://consistent.com');
      
      const result1 = getBaseUrl();
      const result2 = getBaseUrl();
      const result3 = getBaseUrl();
      
      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
    });

    it('deve ser uma função pura (sem side effects)', () => {
      vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://test.com');
      const envBefore = { ...process.env };
      
      getBaseUrl();
      
      // Verificar que process.env não foi modificado (além dos stubs)
      expect(process.env.NEXT_PUBLIC_API_URL).toBe(envBefore.NEXT_PUBLIC_API_URL);
    });

    it('deve responder imediatamente (síncrono)', () => {
      vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://fast.com');
      
      const start = Date.now();
      getBaseUrl();
      const duration = Date.now() - start;
      
      // Deve ser instantâneo (< 10ms)
      expect(duration).toBeLessThan(10);
    });
  });
});