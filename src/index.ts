// src/index.ts
// Punto de entrada del sistema: Bootstrap del contenedor de dependencias e inicio de la aplicacion.
// Por que: Composition Root - aqui se ensamblan todas las piezas, se inyectan dependencias.
// Para que: Iniciar el cajero desde consola con: npm run dev

import { InMemoryCuentaRepository } from './infrastructure/persistence/in-memory-cuenta-repository';
import { InMemoryCajeroRepository } from './infrastructure/persistence/in-memory-cajero-repository';
import { ConsolePresenter } from './infrastructure/console/console-presenter';
import { MenuController } from './infrastructure/console/menu-controller';
import { ConsultarSaldoUseCase } from './application/use-cases/consultar-saldo';
import { DepositarDineroUseCase } from './application/use-cases/depositar-dinero';
import { RetirarDineroUseCase } from './application/use-cases/retirar-dinero';
import { RecargarCajeroUseCase } from './application/use-cases/recargar-cajero';
import { CuentaBancaria } from './domain/entities/cuenta-bancaria';
import { createDinero } from './domain/value-objects/dinero';

const main = async (): Promise<void> => {
  const cuentaRepo = new InMemoryCuentaRepository();
  const cajeroRepo = new InMemoryCajeroRepository();
  const presenter = new ConsolePresenter();
  
  const dineroResult = createDinero(1000, 'USD');
  if (dineroResult.kind === 'ok') {
    const cuenta = new CuentaBancaria('cuenta-001', 'Juan Perez', dineroResult.value);
    await cuentaRepo.guardar(cuenta);
  }
  
  const consultarSaldo = new ConsultarSaldoUseCase(cuentaRepo, presenter);
  const depositarDinero = new DepositarDineroUseCase(cuentaRepo, presenter);
  const retirarDinero = new RetirarDineroUseCase(cuentaRepo, cajeroRepo, presenter);
  const recargarCajero = new RecargarCajeroUseCase(cajeroRepo, presenter);
  
  const controller = new MenuController(presenter, consultarSaldo, depositarDinero, retirarDinero, recargarCajero);
  await controller.iniciar();
};

const bootstrap = async (): Promise<void> => {
  try {
    await main();
  } catch (error) {
    console.error('Error fatal:', error);
    process.exit(1);
  }
};

void bootstrap();
