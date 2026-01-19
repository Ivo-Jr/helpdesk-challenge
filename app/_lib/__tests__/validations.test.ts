import { describe, it, expect } from 'vitest';
import { ticketSchema } from '../validations';

describe('ticketSchema', () => {
  // Helper para criar dados válidos base
  const validBaseData = {
    title: 'Título válido do ticket',
    description: 'Descrição válida com mais de 20 caracteres para passar na validação',
    email: 'user@empresa.com',
    priority: 'medium' as const,
    category: 'other' as const,
    status: 'open' as const,
    attachmentUrl: '',
  };

  describe('Validações Básicas - Campos Obrigatórios', () => {
    it('deve aceitar dados válidos completos', () => {
      const result = ticketSchema.safeParse(validBaseData);
      expect(result.success).toBe(true);
    });

    describe('title', () => {
      it('deve rejeitar título com menos de 5 caracteres', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          title: 'abc',
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            'Título deve ter no mínimo 5 caracteres'
          );
        }
      });

      it('deve aceitar título com exatamente 5 caracteres', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          title: '12345',
        });
        expect(result.success).toBe(true);
      });

      it('deve aceitar título com mais de 5 caracteres', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          title: 'Título longo válido',
        });
        expect(result.success).toBe(true);
      });

      it('deve rejeitar título vazio', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          title: '',
        });
        expect(result.success).toBe(false);
      });
    });

    describe('description', () => {
      it('deve rejeitar descrição com menos de 20 caracteres', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          description: 'Descrição curta',
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            'Descrição deve ter no mínimo 20 caracteres'
          );
        }
      });

      it('deve aceitar descrição com exatamente 20 caracteres', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          description: '12345678901234567890', // exatamente 20
        });
        expect(result.success).toBe(true);
      });

      it('deve aceitar descrição com mais de 20 caracteres', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          description: 'Esta é uma descrição bem longa e detalhada do problema',
        });
        expect(result.success).toBe(true);
      });

      it('deve rejeitar descrição vazia', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          description: '',
        });
        expect(result.success).toBe(false);
      });
    });

    describe('email', () => {
      it('deve aceitar email válido', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          email: 'usuario@dominio.com',
        });
        expect(result.success).toBe(true);
      });

      it('deve rejeitar email sem @', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          email: 'emailinvalido.com',
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('E-mail inválido');
        }
      });

      it('deve rejeitar email sem domínio', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          email: 'usuario@',
        });
        expect(result.success).toBe(false);
      });

      it('deve rejeitar email vazio', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          email: '',
        });
        expect(result.success).toBe(false);
      });

      it('deve aceitar email com subdomínios', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          email: 'user@mail.empresa.com.br',
        });
        expect(result.success).toBe(true);
      });
    });

    describe('priority', () => {
      it('deve aceitar priority "low"', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          priority: 'low',
        });
        expect(result.success).toBe(true);
      });

      it('deve aceitar priority "medium"', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          priority: 'medium',
        });
        expect(result.success).toBe(true);
      });

      it('deve aceitar priority "high"', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          priority: 'high',
          description: 'A'.repeat(60), // high priority precisa de 60+ caracteres
        });
        expect(result.success).toBe(true);
      });
    });

    describe('category', () => {
      it('deve aceitar category "bug"', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          category: 'bug',
          title: '[BUG] Título válido', // bug precisa de [BUG]
        });
        expect(result.success).toBe(true);
      });

      it('deve aceitar category "billing"', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          category: 'billing',
          email: 'user@empresa.com.br', // billing precisa de email corporativo
        });
        expect(result.success).toBe(true);
      });

      it('deve aceitar category "feature"', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          category: 'feature',
        });
        expect(result.success).toBe(true);
      });

      it('deve aceitar category "other"', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          category: 'other',
        });
        expect(result.success).toBe(true);
      });
    });

    describe('status', () => {
      it('deve aceitar status "open"', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          status: 'open',
        });
        expect(result.success).toBe(true);
      });

      it('deve aceitar status "in_progress"', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          status: 'in_progress',
        });
        expect(result.success).toBe(true);
      });

      it('deve aceitar status "resolved"', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          status: 'resolved',
        });
        expect(result.success).toBe(true);
      });
    });

    describe('attachmentUrl', () => {
      it('deve aceitar URL válida', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          attachmentUrl: 'https://exemplo.com/arquivo.pdf',
        });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.attachmentUrl).toBe(
            'https://exemplo.com/arquivo.pdf'
          );
        }
      });

      it('deve transformar string vazia em undefined', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          attachmentUrl: '',
        });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.attachmentUrl).toBeUndefined();
        }
      });

      it('deve rejeitar URL inválida', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          attachmentUrl: 'url-invalida',
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('URL inválida');
        }
      });

      it('deve aceitar URL com http', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          attachmentUrl: 'http://exemplo.com/file.txt',
        });
        expect(result.success).toBe(true);
      });

      it('deve aceitar URL com https', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          attachmentUrl: 'https://exemplo.com/file.txt',
        });
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Validações Condicionais', () => {
    describe('Billing: email corporativo obrigatório', () => {
      it('deve rejeitar billing com email do Gmail', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          category: 'billing',
          email: 'user@gmail.com',
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          const emailError = result.error.issues.find(
            (issue) => issue.path[0] === 'email'
          );
          expect(emailError?.message).toBe(
            'Para tickets de cobrança, use um e-mail corporativo'
          );
        }
      });

      it('deve rejeitar billing com email do Hotmail', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          category: 'billing',
          email: 'user@hotmail.com',
        });
        expect(result.success).toBe(false);
      });

      it('deve rejeitar billing com email do Yahoo', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          category: 'billing',
          email: 'user@yahoo.com',
        });
        expect(result.success).toBe(false);
      });

      it('deve rejeitar billing com email do Outlook', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          category: 'billing',
          email: 'user@outlook.com',
        });
        expect(result.success).toBe(false);
      });

      it('deve aceitar billing com email corporativo', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          category: 'billing',
          email: 'financeiro@empresa.com.br',
        });
        expect(result.success).toBe(true);
      });

      it('deve aceitar billing com email corporativo de subdomínio', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          category: 'billing',
          email: 'admin@mail.empresa.io',
        });
        expect(result.success).toBe(true);
      });

      it('NÃO deve validar email corporativo em outras categorias', () => {
        // Gmail é permitido em categorias que não são billing
        const result = ticketSchema.safeParse({
          ...validBaseData,
          category: 'other',
          email: 'user@gmail.com',
        });
        expect(result.success).toBe(true);
      });
    });

    describe('High Priority: descrição longa obrigatória (≥60 caracteres)', () => {
      it('deve rejeitar high priority com descrição de 59 caracteres', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          priority: 'high',
          description: 'A'.repeat(59),
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          const descError = result.error.issues.find(
            (issue) => issue.path[0] === 'description'
          );
          expect(descError?.message).toBe(
            'Tickets de alta prioridade exigem descrição com mínimo de 60 caracteres'
          );
        }
      });

      it('deve aceitar high priority com descrição de exatamente 60 caracteres', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          priority: 'high',
          description: 'A'.repeat(60),
        });
        expect(result.success).toBe(true);
      });

      it('deve aceitar high priority com descrição de mais de 60 caracteres', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          priority: 'high',
          description: 'A'.repeat(100),
        });
        expect(result.success).toBe(true);
      });

      it('NÃO deve validar descrição longa em low priority', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          priority: 'low',
          description: 'Descrição com 20 chars', // exatamente 20
        });
        expect(result.success).toBe(true);
      });

      it('NÃO deve validar descrição longa em medium priority', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          priority: 'medium',
          description: 'Descrição com 20 chars', // exatamente 20
        });
        expect(result.success).toBe(true);
      });
    });

    describe('Bug: título deve começar com [BUG]', () => {
      it('deve rejeitar bug sem [BUG] no título', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          category: 'bug',
          title: 'Título sem prefixo',
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          const titleError = result.error.issues.find(
            (issue) => issue.path[0] === 'title'
          );
          expect(titleError?.message).toBe(
            'Tickets de bug devem começar com [BUG] no título'
          );
        }
      });

      it('deve rejeitar bug com [BUG] em minúsculas', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          category: 'bug',
          title: '[bug] Título em minúsculas',
        });
        expect(result.success).toBe(false);
      });

      it('deve rejeitar bug com [BUG] no meio do título', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          category: 'bug',
          title: 'Título com [BUG] no meio',
        });
        expect(result.success).toBe(false);
      });

      it('deve aceitar bug com [BUG] no início', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          category: 'bug',
          title: '[BUG] Título válido',
        });
        expect(result.success).toBe(true);
      });

      it('deve aceitar bug com [BUG] e texto adicional', () => {
        const result = ticketSchema.safeParse({
          ...validBaseData,
          category: 'bug',
          title: '[BUG] Sistema não carrega após login',
        });
        expect(result.success).toBe(true);
      });

      it('NÃO deve validar [BUG] em outras categorias', () => {
        // Título sem [BUG] é permitido em categorias que não são bug
        const result = ticketSchema.safeParse({
          ...validBaseData,
          category: 'feature',
          title: 'Nova funcionalidade',
        });
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Cenários Complexos - Múltiplas Validações', () => {
    it('deve aceitar bug de high priority com todas as validações', () => {
      const result = ticketSchema.safeParse({
        title: '[BUG] Sistema crítico fora do ar',
        description: 'A'.repeat(60), // high priority precisa ≥60
        email: 'admin@empresa.com',
        priority: 'high',
        category: 'bug',
        status: 'open',
        attachmentUrl: 'https://exemplo.com/screenshot.png',
      });
      expect(result.success).toBe(true);
    });

    it('deve rejeitar bug de high priority sem [BUG]', () => {
      const result = ticketSchema.safeParse({
        title: 'Sistema crítico fora do ar', // falta [BUG]
        description: 'A'.repeat(60),
        email: 'admin@empresa.com',
        priority: 'high',
        category: 'bug',
        status: 'open',
        attachmentUrl: '',
      });
      expect(result.success).toBe(false);
    });

    it('deve rejeitar bug de high priority com descrição curta', () => {
      const result = ticketSchema.safeParse({
        title: '[BUG] Sistema fora do ar',
        description: 'Descrição muito curta', // menos de 60
        email: 'admin@empresa.com',
        priority: 'high',
        category: 'bug',
        status: 'open',
        attachmentUrl: '',
      });
      expect(result.success).toBe(false);
    });

    it('deve aceitar billing de low priority com email corporativo', () => {
      const result = ticketSchema.safeParse({
        title: 'Cobrança duplicada',
        description: 'Cobrança apareceu duas vezes no meu extrato',
        email: 'financeiro@empresa.com',
        priority: 'low',
        category: 'billing',
        status: 'open',
        attachmentUrl: '',
      });
      expect(result.success).toBe(true);
    });

    it('deve rejeitar billing de low priority com email público', () => {
      const result = ticketSchema.safeParse({
        title: 'Cobrança duplicada',
        description: 'Cobrança apareceu duas vezes',
        email: 'user@gmail.com', // email público não permitido em billing
        priority: 'low',
        category: 'billing',
        status: 'open',
        attachmentUrl: '',
      });
      expect(result.success).toBe(false);
    });

    it('deve retornar múltiplos erros quando houver múltiplas violações', () => {
      const result = ticketSchema.safeParse({
        title: 'ab', // título muito curto
        description: 'curta', // descrição muito curta
        email: 'email-invalido', // email inválido
        priority: 'medium',
        category: 'other',
        status: 'open',
        attachmentUrl: '',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThanOrEqual(3);
      }
    });
  });

  describe('Edge Cases', () => {
    it('deve aceitar ticket completo com todos os campos opcionais preenchidos', () => {
      const result = ticketSchema.safeParse({
        title: 'Ticket completo',
        description: 'Descrição detalhada do ticket com mais de 20 caracteres',
        email: 'user@empresa.com',
        priority: 'medium',
        category: 'other',
        status: 'open',
        attachmentUrl: 'https://exemplo.com/anexo.pdf',
      });
      expect(result.success).toBe(true);
    });

    it('deve aceitar ticket com caracteres especiais no título', () => {
      const result = ticketSchema.safeParse({
        ...validBaseData,
        title: 'Título com @#$%&*() especiais',
      });
      expect(result.success).toBe(true);
    });

    it('deve aceitar descrição com quebras de linha', () => {
      const result = ticketSchema.safeParse({
        ...validBaseData,
        description: 'Linha 1\nLinha 2\nLinha 3 com mais de 20 caracteres',
      });
      expect(result.success).toBe(true);
    });

    it('deve aceitar título exatamente no limite mínimo após [BUG]', () => {
      const result = ticketSchema.safeParse({
        ...validBaseData,
        category: 'bug',
        title: '[BUG]', // exatamente 5 caracteres
      });
      expect(result.success).toBe(true);
    });

    it('deve aceitar email com caracteres especiais válidos', () => {
      const result = ticketSchema.safeParse({
        ...validBaseData,
        email: 'user.name+tag@empresa-exemplo.com.br',
      });
      expect(result.success).toBe(true);
    });

    it('deve transformar attachmentUrl vazio mesmo em dados válidos', () => {
      const result = ticketSchema.safeParse({
        ...validBaseData,
        attachmentUrl: '',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.attachmentUrl).toBeUndefined();
      }
    });
  });
});

