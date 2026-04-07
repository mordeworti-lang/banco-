import { describe, it, expect } from 'vitest';
import { CuentaBancaria } from '@/domain/entities/cuenta-bancaria';
import { createDinero } from '@/domain/value-objects/dinero';

describe('CuentaBancaria', () => {
  it('deberia crear cuenta con saldo inicial positivo', () => {
    const dinero = createDinero(1000, 'USD');
    expect(dinero.kind).toBe('ok');
    if (dinero.kind !== 'ok') return;
    
    const cuenta = new CuentaBancaria('001', 'Juan', dinero.value);
    expect(cuenta.id).toBe('001');
    expect(cuenta.titular).toBe('Juan');
    expect(cuenta.saldo.cantidad).toBe(1000);
  });

  it('deberia depositar aumentando saldo correctamente', () => {
    const dinero = createDinero(1000, 'USD');
    expect(dinero.kind).toBe('ok');
    if (dinero.kind !== 'ok') return;
    
    const cuenta = new CuentaBancaria('001', 'Juan', dinero.value);
    const deposito = createDinero(500, 'USD');
    expect(deposito.kind).toBe('ok');
    if (deposito.kind !== 'ok') return;
    
    const result = cuenta.depositar(deposito.value);
    expect(result.kind).toBe('ok');
    expect(cuenta.saldo.cantidad).toBe(1500);
  });

  it('deberia retirar con saldo suficiente', () => {
    const dinero = createDinero(1000, 'USD');
    expect(dinero.kind).toBe('ok');
    if (dinero.kind !== 'ok') return;
    
    const cuenta = new CuentaBancaria('001', 'Juan', dinero.value);
    const retiro = createDinero(500, 'USD');
    expect(retiro.kind).toBe('ok');
    if (retiro.kind !== 'ok') return;
    
    const result = cuenta.retirar(retiro.value);
    expect(result.kind).toBe('ok');
    expect(cuenta.saldo.cantidad).toBe(500);
  });

  it('deberia fallar al retirar mas de lo que tiene', () => {
    const dinero = createDinero(1000, 'USD');
    expect(dinero.kind).toBe('ok');
    if (dinero.kind !== 'ok') return;
    
    const cuenta = new CuentaBancaria('001', 'Juan', dinero.value);
    const retiro = createDinero(1500, 'USD');
    expect(retiro.kind).toBe('ok');
    if (retiro.kind !== 'ok') return;
    
    const result = cuenta.retirar(retiro.value);
    expect(result.kind).toBe('err');
    if (result.kind === 'err') {
      expect(result.error.kind).toBe('insufficient_funds');
    }
    expect(cuenta.saldo.cantidad).toBe(1000);
  });

  it('deberia fallar al depositar monto negativo', () => {
    const dinero = createDinero(1000, 'USD');
    expect(dinero.kind).toBe('ok');
    if (dinero.kind !== 'ok') return;
    
    new CuentaBancaria('001', 'Juan', dinero.value);
    const deposito = createDinero(-100, 'USD');
    expect(deposito.kind).toBe('err');
    if (deposito.kind === 'err') {
      expect(deposito.error.kind).toBe('invalid_amount');
    }
  });

  it('deberia fallar al retirar monto negativo', () => {
    const dinero = createDinero(1000, 'USD');
    expect(dinero.kind).toBe('ok');
    if (dinero.kind !== 'ok') return;
    
    new CuentaBancaria('001', 'Juan', dinero.value);
    const retiro = createDinero(-100, 'USD');
    expect(retiro.kind).toBe('err');
    if (retiro.kind === 'err') {
      expect(retiro.error.kind).toBe('invalid_amount');
    }
  });
});
