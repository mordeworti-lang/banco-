// src/application/ports/output/presenter.ts
// Puerto de salida: Interfaz que Application usa para emitir resultados.
// Por que: Application no debe saber si es console, web, o API REST.
// Para que: Infrastructure implementa esto con tecnologia especifica (console.log, res.json, etc).

import type { Dinero } from '../../../domain/value-objects/dinero.js';
import type { DomainError } from '../../../domain/errors/domain-error.js';

export type Presenter = {
  mostrarSaldo(cuentaId: string, saldo: Dinero): void;
  mostrarOperacionExitosa(tipo: 'deposito' | 'retiro', monto: Dinero): void;
  mostrarError(error: DomainError): void;
  solicitarInput(mensaje: string): Promise<string>;
  confirmarRetiroDisponible(disponible: number, solicitado: number): Promise<boolean>;
};
