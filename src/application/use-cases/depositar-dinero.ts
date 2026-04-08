// src/application/use-cases/depositar-dinero.ts
// Caso de uso: Depositar dinero en cuenta.
// Por que: Coordina verificacion de cuenta, operacion de dominio, persistencia, feedback.
// Para que: Flujo completo de deposito con manejo de errores en cada paso.

import type { CuentaRepository } from '../../domain/repositories/cuenta-repository';
import type { Presenter } from '../ports/output/presenter';
import type { DepositarInput } from '../ports/input/depositar-input';
import { accountNotFound } from '../../domain/errors/domain-error';

export class DepositarDineroUseCase {
  constructor(
    private readonly cuentaRepo: CuentaRepository,
    private readonly presenter: Presenter
  ) {}

  async ejecutar(input: DepositarInput): Promise<void> {
    const cuentaResult = await this.cuentaRepo.buscarPorId(input.cuentaId);
    if (cuentaResult.kind === 'err') {
      this.presenter.mostrarError(cuentaResult.error);
      return;
    }
    const cuenta = cuentaResult.value;
    if (!cuenta) {
      this.presenter.mostrarError(accountNotFound(input.cuentaId));
      return;
    }
    const depositoResult = cuenta.depositar(input.monto);
    if (depositoResult.kind === 'err') {
      this.presenter.mostrarError(depositoResult.error);
      return;
    }
    const guardarResult = await this.cuentaRepo.guardar(cuenta);
    if (guardarResult.kind === 'err') {
      this.presenter.mostrarError(guardarResult.error);
      return;
    }
    this.presenter.mostrarOperacionExitosa('deposito', input.monto);
  }
}
