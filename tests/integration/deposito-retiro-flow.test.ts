import { describe, it, expect } from 'vitest';
import { CuentaBancaria } from '@/domain/entities/cuenta-bancaria';
import { createDinero } from '@/domain/value-objects/dinero';
import { InMemoryCuentaRepository } from '@/infrastructure/persistence/in-memory-cuenta-repository';

describe('CuentaBancaria + Repository Integration', () => {
  it('deberia persistir deposito y permitir retiro del total', async () => {
    const repo = new InMemoryCuentaRepository();
    
    const dineroInicial = createDinero(1000, 'USD');
    expect(dineroInicial.kind).toBe('ok');
    if (dineroInicial.kind !== 'ok') return;
    
    const cuenta = new CuentaBancaria('test-001', 'Juan', dineroInicial.value);
    await repo.guardar(cuenta);
    
    const deposito = createDinero(500, 'USD');
    expect(deposito.kind).toBe('ok');
    if (deposito.kind !== 'ok') return;
    
    const busqueda1 = await repo.buscarPorId('test-001');
    expect(busqueda1.kind).toBe('ok');
    if (busqueda1.kind !== 'ok') return;
    expect(busqueda1.value).not.toBeNull();
    if (!busqueda1.value) return;
    
    const cuentaGuardada = busqueda1.value;
    const resultadoDeposito = cuentaGuardada.depositar(deposito.value);
    expect(resultadoDeposito.kind).toBe('ok');
    
    await repo.guardar(cuentaGuardada);
    
    const busqueda2 = await repo.buscarPorId('test-001');
    expect(busqueda2.kind).toBe('ok');
    if (busqueda2.kind !== 'ok') return;
    expect(busqueda2.value).not.toBeNull();
    if (!busqueda2.value) return;
    
    const cuentaActualizada = busqueda2.value;
    expect(cuentaActualizada.saldo.cantidad).toBe(1500);
    
    const retiroTotal = createDinero(1500, 'USD');
    expect(retiroTotal.kind).toBe('ok');
    if (retiroTotal.kind !== 'ok') return;
    
    const resultadoRetiro = cuentaActualizada.retirar(retiroTotal.value);
    expect(resultadoRetiro.kind).toBe('ok');
    expect(cuentaActualizada.saldo.cantidad).toBe(0);
    
    await repo.guardar(cuentaActualizada);
    
    const busqueda3 = await repo.buscarPorId('test-001');
    expect(busqueda3.kind).toBe('ok');
    if (busqueda3.kind !== 'ok') return;
    expect(busqueda3.value?.saldo.cantidad).toBe(0);
  });
});
