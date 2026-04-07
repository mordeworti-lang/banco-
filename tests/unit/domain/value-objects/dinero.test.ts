// tests/unit/domain/value-objects/dinero.test.ts
// Test del value object Dinero.
// Por que: Las operaciones monetarias deben ser seguras.
// Para que: Validar que no se mezclen monedas ni se creen montos invalidos.

import { describe, it, expect } from 'vitest';
import { createDinero, add, subtract, isGreaterThan } from '@/domain/value-objects/dinero';

describe('Dinero', () => {
  it('deberia crear dinero valido', () => {
    const result = createDinero(100, 'USD');
    expect(result.kind).toBe('ok');
    if (result.kind === 'ok') {
      expect(result.value.cantidad).toBe(100);
      expect(result.value.moneda).toBe('USD');
    }
  });

  it('deberia fallar con monto negativo', () => {
    const result = createDinero(-100, 'USD');
    expect(result.kind).toBe('err');
  });

  it('deberia sumar dos cantidades', () => {
    const a = createDinero(100, 'USD');
    const b = createDinero(50, 'USD');
    expect(a.kind).toBe('ok');
    expect(b.kind).toBe('ok');
    if (a.kind !== 'ok' || b.kind !== 'ok') return;
    
    const result = add(a.value, b.value);
    expect(result.kind).toBe('ok');
    if (result.kind === 'ok') {
      expect(result.value.cantidad).toBe(150);
    }
  });

  it('deberia sumar dos cantidades de monedas diferentes', () => {
    const a = createDinero(100, 'USD');
    const b = createDinero(50, 'EUR');
    expect(a.kind).toBe('ok');
    expect(b.kind).toBe('ok');
    if (a.kind !== 'ok' || b.kind !== 'ok') return;
    
    const result = add(a.value, b.value);
    expect(result.kind).toBe('err');
  });

  it('deberia restar dos cantidades', () => {
    const a = createDinero(100, 'USD');
    const b = createDinero(30, 'USD');
    expect(a.kind).toBe('ok');
    expect(b.kind).toBe('ok');
    if (a.kind !== 'ok' || b.kind !== 'ok') return;
    
    const result = subtract(a.value, b.value);
    expect(result.kind).toBe('ok');
    if (result.kind === 'ok') {
      expect(result.value.cantidad).toBe(70);
    }
  });

  it('deberia restar dos cantidades con resultado negativo', () => {
    const a = createDinero(30, 'USD');
    const b = createDinero(100, 'USD');
    expect(a.kind).toBe('ok');
    expect(b.kind).toBe('ok');
    if (a.kind !== 'ok' || b.kind !== 'ok') return;
    
    const result = subtract(a.value, b.value);
    expect(result.kind).toBe('err');
  });

  it('deberia comparar correctamente', () => {
    const a = createDinero(100, 'USD');
    const b = createDinero(50, 'USD');
    expect(a.kind).toBe('ok');
    expect(b.kind).toBe('ok');
    if (a.kind !== 'ok' || b.kind !== 'ok') return;
    
    expect(isGreaterThan(a.value, b.value)).toBe(true);
    expect(isGreaterThan(b.value, a.value)).toBe(false);
  });
});
