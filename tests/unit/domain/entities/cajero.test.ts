// tests/unit/domain/entities/cajero.test.ts
// Test unitario del Cajero.
// Por que: El cajero es entidad independiente con su propia lógica.
// Para que: Validar que el cajero no dispense más de lo que tiene.

import { describe, it, expect } from 'vitest';
import { Cajero } from '@/domain/entities/cajero';
import { createDinero } from '@/domain/value-objects/dinero';

describe('Cajero', () => {
  it('deberia crear cajero con efectivo inicial', () => {
    const dinero = createDinero(10000, 'USD');
    expect(dinero.kind).toBe('ok');
    if (dinero.kind !== 'ok') return;
    
    const cajero = new Cajero('cajero-001', dinero.value);
    expect(cajero.id).toBe('cajero-001');
    expect(cajero.efectivoDisponible.cantidad).toBe(10000);
  });

  it('deberia dispensar cuando hay suficiente efectivo', () => {
    const dinero = createDinero(10000, 'USD');
    expect(dinero.kind).toBe('ok');
    if (dinero.kind !== 'ok') return;
    
    const cajero = new Cajero('cajero-001', dinero.value);
    const monto = createDinero(5000, 'USD');
    expect(monto.kind).toBe('ok');
    if (monto.kind !== 'ok') return;
    
    const result = cajero.dispensar(monto.value);
    expect(result.kind).toBe('ok');
    expect(cajero.efectivoDisponible.cantidad).toBe(5000);
  });

  it('deberia fallar al dispensar sin suficiente efectivo', () => {
    const dinero = createDinero(1000, 'USD');
    expect(dinero.kind).toBe('ok');
    if (dinero.kind !== 'ok') return;
    
    const cajero = new Cajero('cajero-001', dinero.value);
    const monto = createDinero(5000, 'USD');
    expect(monto.kind).toBe('ok');
    if (monto.kind !== 'ok') return;
    
    const result = cajero.dispensar(monto.value);
    expect(result.kind).toBe('err');
    expect(cajero.efectivoDisponible.cantidad).toBe(1000);
  });

  it('deberia recargar efectivo correctamente', () => {
    const dinero = createDinero(5000, 'USD');
    expect(dinero.kind).toBe('ok');
    if (dinero.kind !== 'ok') return;
    
    const cajero = new Cajero('cajero-001', dinero.value);
    const recarga = createDinero(3000, 'USD');
    expect(recarga.kind).toBe('ok');
    if (recarga.kind !== 'ok') return;
    
    const result = cajero.recargarEfectivo(recarga.value);
    expect(result.kind).toBe('ok');
    expect(cajero.efectivoDisponible.cantidad).toBe(8000);
  });
});
