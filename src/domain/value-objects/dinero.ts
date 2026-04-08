// src/domain/value-objects/dinero.ts
// Value Object: Representa cantidad monetaria. Inmutable, validada en construccion.
// Por que: Evitar primitive obsession, encapsular logica de moneda y validacion.
// Para que: CuentaBancaria y Cajero trabajan con Dinero, no number suelto.

import { ok, err, type Result } from '../../shared/result';
import { isPositiveNumber } from '../../shared/validators';
import { invalidAmount, type DomainError } from '../errors/domain-error';

export type Moneda = 'USD' | 'EUR' | 'PEN';

export type Dinero = {
  readonly cantidad: number;
  readonly moneda: Moneda;
};

export const createDinero = (
  cantidad: number,
  moneda: Moneda
): Result<Dinero, DomainError> => {
  if (!isPositiveNumber(cantidad)) {
    return err(invalidAmount(cantidad));
  }
  return ok({ cantidad, moneda });
};

export const add = (a: Dinero, b: Dinero): Result<Dinero, DomainError> => {
  if (a.moneda !== b.moneda) {
    return err({ kind: 'invalid_amount', message: 'No se pueden sumar diferentes monedas', monto: 0 });
  }
  return ok({ cantidad: a.cantidad + b.cantidad, moneda: a.moneda });
};

export const subtract = (a: Dinero, b: Dinero): Result<Dinero, DomainError> => {
  if (a.moneda !== b.moneda) {
    return err({ kind: 'invalid_amount', message: 'No se pueden restar diferentes monedas', monto: 0 });
  }
  if (a.cantidad < b.cantidad) {
    return err({ kind: 'insufficient_funds', message: 'Resultado seria negativo', cuentaId: '' });
  }
  return ok({ cantidad: a.cantidad - b.cantidad, moneda: a.moneda });
};

export const isGreaterThan = (a: Dinero, b: Dinero): boolean => {
  if (a.moneda !== b.moneda) return false;
  return a.cantidad > b.cantidad;
};
