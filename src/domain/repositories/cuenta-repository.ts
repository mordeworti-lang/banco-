// src/domain/repositories/cuenta-repository.ts
// Puerto (interfaz de salida): Contrato para persistencia de cuentas.
// Por que: Domain define que necesita, Infrastructure implementa como (SQL, NoSQL, memoria).
// Para que: Inversion de dependencias, testear use cases con repositorio en memoria.

import type { CuentaBancaria } from '../entities/cuenta-bancaria';
import type { Result } from '../../shared/result';
import type { DomainError } from '../errors/domain-error';

export type CuentaRepository = {
  buscarPorId(id: string): Promise<Result<CuentaBancaria | null, DomainError>>;
  guardar(cuenta: CuentaBancaria): Promise<Result<void, DomainError>>;
  existe(id: string): Promise<Result<boolean, DomainError>>;
};
