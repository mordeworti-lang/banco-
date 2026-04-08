// src/application/use-cases/consultar-saldo.ts
// Caso de uso: Consultar el saldo de una cuenta existente.
// Por que: Orquesta repositorio y presentador siguiendo SRP.
// Para que: Controller lo invoca tras parsear input del usuario.

import type { CuentaRepository } from '../../domain/repositories/cuenta-repository';
import type { Presenter } from '../ports/output/presenter';
import type { ConsultarSaldoInput } from '../ports/input/consultar-saldo-input';
import { accountNotFound } from '../../domain/errors/domain-error';

export class ConsultarSaldoUseCase {
  constructor(
    private readonly cuentaRepo: CuentaRepository,
    private readonly presenter: Presenter
  ) {}

  async ejecutar(input: ConsultarSaldoInput): Promise<void> {
    const result = await this.cuentaRepo.buscarPorId(input.cuentaId);
    if (result.kind === 'err') {
      this.presenter.mostrarError(result.error);
      return;
    }
    const cuenta = result.value;
    if (!cuenta) {
      this.presenter.mostrarError(accountNotFound(input.cuentaId));
      return;
    }
    this.presenter.mostrarSaldo(cuenta.id, cuenta.saldo);
  }
}
