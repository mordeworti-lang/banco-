import { describe, it, expect, vi } from 'vitest';
import { ConsultarSaldoUseCase } from '@/application/use-cases/consultar-saldo';
import { CuentaBancaria } from '@/domain/entities/cuenta-bancaria';
import { createDinero } from '@/domain/value-objects/dinero';
import type { CuentaRepository } from '@/domain/repositories/cuenta-repository';
import type { Presenter } from '@/application/ports/output/presenter';
import { ok } from '@/shared/result';

describe('ConsultarSaldo Use Case', () => {
  it('deberia mostrar saldo cuando cuenta existe', async () => {
    const dinero = createDinero(1000, 'USD');
    expect(dinero.kind).toBe('ok');
    if (dinero.kind !== 'ok') return;
    
    const cuenta = new CuentaBancaria('001', 'Juan', dinero.value);
    const mockRepo: CuentaRepository = {
      buscarPorId: vi.fn().mockResolvedValue(ok(cuenta)),
      guardar: vi.fn().mockResolvedValue(ok(undefined)),
      existe: vi.fn().mockResolvedValue(ok(true)),
    };
    
    const mostrarSaldo = vi.fn();
    const mockPresenter: Presenter = {
      mostrarSaldo,
      mostrarOperacionExitosa: vi.fn(),
      mostrarError: vi.fn(),
      solicitarInput: vi.fn(),
      confirmarRetiroDisponible: vi.fn(),
    };
    
    const useCase = new ConsultarSaldoUseCase(mockRepo, mockPresenter);
    await useCase.ejecutar({ cuentaId: '001' });
    
    expect(mostrarSaldo).toHaveBeenCalledWith('001', expect.objectContaining({ cantidad: 1000 }));
  });

  it('deberia mostrar error cuando cuenta no existe', async () => {
    const mockRepo: CuentaRepository = {
      buscarPorId: vi.fn().mockResolvedValue(ok(null)),
      guardar: vi.fn().mockResolvedValue(ok(undefined)),
      existe: vi.fn().mockResolvedValue(ok(false)),
    };
    
    const mostrarError = vi.fn();
    const mockPresenter: Presenter = {
      mostrarSaldo: vi.fn(),
      mostrarOperacionExitosa: vi.fn(),
      mostrarError,
      solicitarInput: vi.fn(),
      confirmarRetiroDisponible: vi.fn(),
    };
    
    const useCase = new ConsultarSaldoUseCase(mockRepo, mockPresenter);
    await useCase.ejecutar({ cuentaId: 'no-existe' });
    
    expect(mostrarError).toHaveBeenCalledWith(expect.objectContaining({ kind: 'account_not_found' }));
  });
});
