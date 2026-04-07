// src/application/ports/input/consultar-saldo-input.ts
// DTO de entrada para caso de uso ConsultarSaldo.
// Por que: Desacoplar interfaz de usuario de logica de aplicacion.
// Para que: ConsoleAdapter construye este DTO desde input del usuario y lo pasa al use case.

import { ok, err, type Result } from '../../../shared/result.js';
import { hasMinLength } from '../../../shared/validators.js';
import { accountNotFound, type DomainError } from '../../../domain/errors/domain-error.js';

export type ConsultarSaldoInput = {
  cuentaId: string;
};

export const createConsultarSaldoInput = (cuentaId: string): Result<ConsultarSaldoInput, DomainError> => {
  if (!hasMinLength(cuentaId, 1)) {
    return err(accountNotFound(cuentaId));
  }
  return ok({ cuentaId });
};
