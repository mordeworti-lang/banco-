// src/application/ports/input/depositar-input.ts
// DTO de entrada para DepositarDinero.
// Por que: Agregar tipos fuertes a parametros de entrada, validar antes de tocar dominio.
// Para que: Validar monto positivo y cuentaId antes de instanciar Dinero o buscar entidad.

import { ok, err, type Result } from '../../../shared/result';
import { hasMinLength, isPositiveNumber } from '../../../shared/validators';
import { invalidAmount, accountNotFound, type DomainError } from '../../../domain/errors/domain-error';
import { createDinero, type Dinero, type Moneda } from '../../../domain/value-objects/dinero';

export type DepositarInput = {
  cuentaId: string;
  monto: Dinero;
};

export const createDepositarInput = (
  cuentaId: string,
  cantidad: number,
  moneda: Moneda
): Result<DepositarInput, DomainError> => {
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
