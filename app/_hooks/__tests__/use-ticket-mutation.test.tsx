import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useTicketMutation } from '../use-ticket-mutation';
import { useTicketStore } from '../../_stores/ticket-store';

describe('useTicketMutation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useTicketStore.setState({ error: null, loading: false });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe('Estados de Loading', () => {
    it('deve gerenciar loading state corretamente', async () => {
      const { result } = renderHook(() => useTicketMutation());

      expect(result.current.isLoading).toBe(false);

      act(() => {
        result.current.mutate(() => Promise.resolve('data'));
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.isSuccess).toBe(true);
      });
    });

    it('deve definir isSuccess como true após sucesso', async () => {
      const { result } = renderHook(() => useTicketMutation({ successDelay: 0 }));

      await act(async () => {
        await result.current.mutate(() => Promise.resolve('data'));
      });

      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('deve limpar success ao iniciar nova mutation', async () => {
      const { result } = renderHook(() => useTicketMutation({ successDelay: 0 }));

      await act(async () => {
        await result.current.mutate(() => Promise.resolve('success'));
      });

      expect(result.current.isSuccess).toBe(true);

      act(() => {
        result.current.mutate(() => Promise.resolve('success2'));
      });

      expect(result.current.isSuccess).toBe(false);
    });
  });

  describe('Callbacks onSuccess', () => {
    it('deve chamar onSuccess após delay configurável', async () => {
      vi.useFakeTimers();
      const onSuccess = vi.fn();
      const { result } = renderHook(() =>
        useTicketMutation({ onSuccess, successDelay: 100 })
      );

      await act(async () => {
        await result.current.mutate(() => Promise.resolve('data'));
      });

      expect(onSuccess).not.toHaveBeenCalled();

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(onSuccess).toHaveBeenCalledWith('data');
      expect(onSuccess).toHaveBeenCalledOnce();
    });

    it('deve usar delay padrão de 1500ms', async () => {
      vi.useFakeTimers();
      const onSuccess = vi.fn();
      const { result } = renderHook(() =>
        useTicketMutation({ onSuccess })
      );

      await act(async () => {
        await result.current.mutate(() => Promise.resolve('data'));
      });

      expect(onSuccess).not.toHaveBeenCalled();

      await act(async () => {
        vi.advanceTimersByTime(1499);
      });
      expect(onSuccess).not.toHaveBeenCalled();

      await act(async () => {
        vi.advanceTimersByTime(1);
      });
      expect(onSuccess).toHaveBeenCalledWith('data');
    });

    it('deve chamar onSuccess com resultado da promise', async () => {
      vi.useFakeTimers();
      const onSuccess = vi.fn();
      const expectedData = { id: '1', name: 'Test' };
      const { result } = renderHook(() =>
        useTicketMutation({ onSuccess, successDelay: 0 })
      );
    
      await act(async () => {
        await result.current.mutate(() => Promise.resolve(expectedData));
      });
    
      await act(async () => {
        vi.runAllTimers();
      });
    
      expect(onSuccess).toHaveBeenCalledWith(expectedData);
    });

    it('deve lidar com promise que resolve undefined', async () => {
      vi.useFakeTimers();
      const onSuccess = vi.fn();
      const { result } = renderHook(() =>
        useTicketMutation({ onSuccess, successDelay: 0 })
      );
    
      await act(async () => {
        await result.current.mutate(() => Promise.resolve(undefined));
      });
    
      expect(result.current.isSuccess).toBe(true);
    
      await act(async () => {
        vi.runAllTimers();
      });
    
      expect(onSuccess).toHaveBeenCalledWith(undefined);
    });

    it('não deve chamar onSuccess quando ocorre erro', async () => {
      const onSuccess = vi.fn();
      const onError = vi.fn();
      const { result } = renderHook(() =>
        useTicketMutation({ onSuccess, onError })
      );

      await act(async () => {
        await result.current.mutate(() => Promise.reject(new Error('Error')));
      });

      expect(onSuccess).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalledOnce();
    });
  });

  describe('Tratamento de Erros', () => {
    it('deve gerenciar erro com Error instance', async () => {
      const { result } = renderHook(() => useTicketMutation());

      await act(async () => {
        await result.current.mutate(() => 
          Promise.reject(new Error('Test error'))
        );
      });

      expect(result.current.error).toBe('Test error');
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSuccess).toBe(false);
    });

    it('deve gerenciar erro genérico (não-Error)', async () => {
      const { result } = renderHook(() => useTicketMutation());

      await act(async () => {
        await result.current.mutate(() => Promise.reject('string error'));
      });

      expect(result.current.error).toBe('Erro na operação');
    });

    it('deve chamar callback onError quando ocorre erro', async () => {
      const onError = vi.fn();
      const testError = new Error('Test error');
      const { result } = renderHook(() =>
        useTicketMutation({ onError })
      );

      await act(async () => {
        await result.current.mutate(() => Promise.reject(testError));
      });

      expect(onError).toHaveBeenCalledWith(testError);
      expect(onError).toHaveBeenCalledOnce();
    });

    it('deve limpar erro ao iniciar nova mutation', async () => {
      const { result } = renderHook(() => useTicketMutation());

      // Primeira mutation com erro
      await act(async () => {
        await result.current.mutate(() => Promise.reject(new Error('First error')));
      });

      expect(result.current.error).toBe('First error');

      // Segunda mutation bem-sucedida
      await act(async () => {
        await result.current.mutate(() => Promise.resolve('success'));
      });

      expect(result.current.error).toBeNull();
      expect(result.current.isSuccess).toBe(true);
    });
  });

  describe('Integração com Zustand Store', () => {
    it('deve sincronizar erro do store', () => {
      useTicketStore.setState({ error: 'Store error' });

      const { result } = renderHook(() => useTicketMutation());

      expect(result.current.error).toBe('Store error');
    });

    it('deve priorizar erro local sobre erro do store', async () => {
      useTicketStore.setState({ error: 'Store error' });

      const { result } = renderHook(() => useTicketMutation());

      await act(async () => {
        await result.current.mutate(() => Promise.reject(new Error('Local error')));
      });

      expect(result.current.error).toBe('Local error');
    });

    it('deve retornar ao erro do store após reset', async () => {
      useTicketStore.setState({ error: 'Store error' });

      const { result } = renderHook(() => useTicketMutation());

      await act(async () => {
        await result.current.mutate(() => Promise.reject(new Error('Local error')));
      });

      expect(result.current.error).toBe('Local error');

      act(() => {
        result.current.reset();
      });

      expect(result.current.error).toBe('Store error');
    });
  });

  describe('Função reset', () => {
    it('deve resetar todos os estados', async () => {
      const { result } = renderHook(() => useTicketMutation());

      await act(async () => {
        await result.current.mutate(() => 
          Promise.reject(new Error('Error'))
        );
      });

      expect(result.current.error).toBe('Error');
      expect(result.current.isSuccess).toBe(false);

      act(() => {
        result.current.reset();
      });

      expect(result.current.error).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSuccess).toBe(false);
    });

    it('deve manter referência estável', () => {
      const { result, rerender } = renderHook(() => useTicketMutation());

      const firstReset = result.current.reset;

      rerender();

      expect(result.current.reset).toBe(firstReset);
    });
  });

  describe('Múltiplas Mutations', () => {
    it('deve manter estado correto em mutations consecutivas', async () => {
      const { result } = renderHook(() => useTicketMutation({ successDelay: 0 }));

      // Primeira - sucesso
      await act(async () => {
        await result.current.mutate(() => Promise.resolve('1'));
      });
      expect(result.current.isSuccess).toBe(true);

      // Segunda - sucesso
      await act(async () => {
        await result.current.mutate(() => Promise.resolve('2'));
      });
      expect(result.current.isSuccess).toBe(true);

      // Terceira - erro
      await act(async () => {
        await result.current.mutate(() => Promise.reject(new Error('Error')));
      });
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.error).toBe('Error');

      // Quarta - sucesso
      await act(async () => {
        await result.current.mutate(() => Promise.resolve('4'));
      });
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.error).toBeNull();
    });
  });

  describe('Estabilidade de Referências', () => {
    it('deve manter referência estável da função mutate', () => {
      const { result, rerender } = renderHook(() => useTicketMutation());

      const firstMutate = result.current.mutate;

      rerender();

      expect(result.current.mutate).toBe(firstMutate);
    });

    it('deve criar nova referência quando options mudam', () => {
      const { result, rerender } = renderHook(
        ({ delay }) => useTicketMutation({ successDelay: delay }),
        { initialProps: { delay: 100 } }
      );

      const firstMutate = result.current.mutate;

      rerender({ delay: 200 });

      expect(result.current.mutate).not.toBe(firstMutate);
    });
  });

  describe('Ciclo de Vida', () => {
    it('não deve causar erro ao desmontar durante operação', async () => {
      vi.useFakeTimers();
      const onSuccess = vi.fn();
      const { result, unmount } = renderHook(() =>
        useTicketMutation({ onSuccess, successDelay: 1000 })
      );

      await act(async () => {
        await result.current.mutate(() => Promise.resolve('data'));
      });

      // Desmontar antes do callback ser chamado
      expect(() => unmount()).not.toThrow();

      // Avançar o tempo - callback não deve ser chamado pois componente desmontou
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });

      // Se foi chamado, não deve causar erro (não testamos se foi ou não,
      // apenas que não causa crash)
    });
  });
});