# Cajero Automático - Sistema de Gestión Bancaria

Sistema de cajero automático desarrollado con **TypeScript** siguiendo principios de **Clean Architecture**, **Domain-Driven Design** y **Programación Funcional**.

## Características

- **Operaciones bancarias**: Consulta de saldo, depósitos y retiros
- **Autenticación por roles**: Clientes y Administradores
- **Gestión de cajero**: Recarga de efectivo (solo admin)
- **Cobertura de pruebas**: 20 tests unitarios e integración
- **Arquitectura limpia**: Domain, Application e Infrastructure separadas
- **Manejo funcional de errores**: Sin excepciones, usando `Result<T,E>`

## Tecnologías

| Tecnología | Propósito |
|------------|-----------|
| TypeScript 5.x | Lenguaje principal (100%) |
| Vitest | Testing unitario e integración |
| ESLint + Prettier | Calidad de código y formateo |
| tsx | Ejecución de TypeScript sin compilación |
| Node.js 18+ | Runtime |

## Instalación

```bash
# Clonar repositorio
git clone https://github.com/mordeworti-lang/banco-.git
cd banco-

# Instalar dependencias
npm install
```

## Uso

### Iniciar aplicación (modo desarrollo)
```bash
npm run dev
```

### Flujo de uso
1. **Iniciar sesión**: Ingresar ID de cuenta (ej: `cuenta-001`)
2. **Menú Cliente**: Consultar saldo, depositar, retirar dinero
3. **Menú Administrador**: Acceder con ID que inicie con `admin-` para recargar el cajero

## Testing

```bash
# Ejecutar todos los tests
npm test

# Modo watch (desarrollo)
npm run test:watch

# Reporte de cobertura
npm run coverage
```

### Tests incluidos
- **Domain**: Entidades `CuentaBancaria`, `Cajero`, Value Object `Dinero`
- **Application**: Casos de uso con mocks
- **Integration**: Flujo completo depósito-retiro

## Arquitectura

```
src/
├── domain/              # Núcleo de negocio (sin dependencias externas)
│   ├── entities/        # CuentaBancaria, Cajero
│   ├── repositories/    # Interfaces de persistencia
│   └── errors/          # Errores de dominio tipados
├── application/         # Casos de uso
│   ├── use-cases/       # ConsultarSaldo, Depositar, Retirar, Recargar
│   └── ports/           # Interfaces de entrada/salida
├── infrastructure/    # Implementaciones concretas
│   ├── persistence/     # Repositorios en memoria
│   └── console/         # UI por línea de comandos
└── shared/              # Utilidades transversales
    └── result.ts        # Tipo Result<T,E> para manejo funcional
```

### Principios aplicados
- **Dependency Inversion**: Domain no conoce Infrastructure
- **Single Responsibility**: Cada clase tiene una razón de cambiar
- **Railway-oriented programming**: Errores como valores, no excepciones

## Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Ejecutar en modo desarrollo |
| `npm run build` | Compilar TypeScript |
| `npm test` | Ejecutar tests |
| `npm run lint` | Análisis estático con ESLint |
| `npm run format` | Formatear código con Prettier |
| `npm run typecheck` | Verificación de tipos |

## Calidad de código

El proyecto mantiene estándares estrictos:
- **ESLint** con reglas estrictas de TypeScript
- **Prettier** para formateo consistente
- **Cobertura de tests** en toda la lógica de negocio
- **Sin archivos JavaScript**: Código 100% TypeScript

## Licencia

ISC

---

**Autor**: Jhon Stiven Zuluaga Jaramillo

Desarrollado siguiendo las mejores prácticas de TypeScript y Clean Architecture.
