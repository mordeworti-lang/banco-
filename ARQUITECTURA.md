/**
 * ARQUITECTURA.md
 * 
 * Clean Architecture Modular - Cajero Automático
 * 
 * PRINCIPIOS FUNDAMENTALES:
 * 
 * 1. Dependency Rule: Las flechas de dependencia apuntan siempre hacia
 *    adentro. Domain no conoce Application ni Infrastructure.
 * 
 * 2. Capas:
 *    - Domain: Entidades, value objects, errores de dominio, interfaces de repositorio.
 *    - Application: Casos de uso, orquestan entidades para cumplir requisitos funcionales.
 *    - Infrastructure: Implementaciones concretas (consola, persistencia, logger).
 *    - Shared: Utilidades transversales, tipo Result<T,E> para manejo funcional de errores.
 * 
 * 3. Flujo de datos:
 *    Controller -> UseCase -> Entity -> Repository (interface) -> Repository (impl)
 * 
 * POR QUE ESTA ESTRUCTURA:
 * 
 * - src/domain/entities/: Contienen reglas de negocio puras, sin dependencias externas.
 *   La clase CuentaBancaria valida invariantes (saldo no negativo) aquí.
 * 
 * - src/domain/repositories/: Contratos que Application necesita. Inversión de dependencias.
 *   Application dice "necesito guardar una cuenta", no sabe si es PostgreSQL, Mongo o memoria.
 * 
 * - src/application/ports/: Interfaces que Application expone a Infrastructure.
 *   ConsolePresenter implementa OutputPort para mostrar resultados sin que Application sepa de console.log.
 * 
 * - src/application/use-cases/: Cada archivo es un caso de uso completo (consultar, depositar, retirar).
 *   Orquestan: validar input -> recuperar entidad -> ejecutar operación -> persistir -> retornar resultado.
 * 
 * - src/infrastructure/persistence/: Implementación de repositorios. Aquí vive el código sucio.
 *   Si mañana cambias de Map in-memory a Prisma, solo tocas esta capa.
 * 
 * - src/infrastructure/console/: Adaptadores de entrada/salida. Presentan el menú, capturan input,
 *   transforman strings a DTOs validados, invocan use cases.
 * 
 * - src/shared/: Código sin acoplamiento al dominio. Result<T,E> permite manejo de errores
 *   sin excepciones, haciendo el flujo de control explicito y type-safe.
 */
