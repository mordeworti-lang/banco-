// src/application/ports/input/retirar-input.ts
// DTO de entrada para RetirarDinero.
// Por que: Similar a depositar pero con validaciones adicionales (cajero debe tener fondos).
// Para que: Pre-validar antes de cargar entidades del repositorio.

import { ok, err, type Result } from '../../../shared/result.js';
import { hasMinLength, isPositiveNumber } from '../../../shared/validators.js';
import { invalidAmount, accountNotFound, type DomainError } from '../../../domain/errors/domain-error.js';
import { createDinero, type Dinero, type Moneda } from '../../../domain/value-objects/dinero.js';

export type RetirarInput = {
  cuentaId: string;
  monto: Dinero;
};

export const createRetirarInput = (
  cuentaId: string,
  cantidad: number,
  moneda: Moneda
): Result<RetirarInput, DomainError> => {
  if (!hasMinLength(cuentaId, 1)) {
    return err(accountNotFound(cuentaId));
  }
  if (!isPositiveNumber(cantidad)) {
    return err(invalidAmount(cantidad));
  }
  const dineroResult = createDinero(cantidad, moneda);
  if (dineroResult.kind === 'err') {
    return err(dineroResult.error);
  }
  return ok({ cuentaId, monto: dineroResult.value });
};
