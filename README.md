# ARCA HR — Sistema de Gestión de Recursos Humanos

Plataforma de microservicios para la gestión integral del ciclo de vida del personal: empleados, vacaciones, contratos y planillas de pago con descuento AFP boliviano.

---

## Inicio Rapido

### Prerrequisitos

| Herramienta | Version minima | Verificar |
|---|---|---|
| .NET SDK | 10.0 | `dotnet --version` |
| dotnet-ef | 9.x / 10.x | `dotnet ef --version` |
| Node.js | 18+ | `node --version` |

Si `dotnet-ef` no esta instalado:
```powershell
dotnet tool install --global dotnet-ef
```

---

## Arranque con un solo comando

Desde la raiz del proyecto, ejecuta en PowerShell:

```powershell
.\start-arca.ps1
```

El script abre **6 ventanas** automaticamente — una por servicio — en el orden correcto de dependencias. Espera unos **20 segundos** a que todos terminen de compilar.

> Si Windows bloquea la ejecucion de scripts la primera vez:
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
> ```

### Detener todos los servicios

```powershell
.\stop-arca.ps1
```

Libera los puertos 5000, 5001, 5002, 5003, 5004 y 5173 de un solo golpe.

---

## Arquitectura de servicios

```
Frontend React (Vite)
        http://localhost:5173
              |
    +---------+---------+-----------+-----------+
    |         |         |           |           |
:5000      :5001      :5002      :5003       :5004
 auth    employee   vacation   contract    payroll
              |                               |
              +---------------+---------------+
               (vacation y payroll consumen employee)
```

---

## Links de acceso

### Aplicacion web

| Recurso | URL |
|---|---|
| **Frontend (app principal)** | http://localhost:5173 |
| **Login** | http://localhost:5173/login |

### Swagger — documentacion interactiva de cada API

| Servicio | Swagger UI | Puerto |
|---|---|---|
| auth-service | http://localhost:5000/swagger | 5000 |
| employee-service | http://localhost:5001/swagger | 5001 |
| vacation-service | http://localhost:5002/swagger | 5002 |
| contract-service | http://localhost:5003/swagger | 5003 |
| payroll-service | http://localhost:5004/swagger | 5004 |

---

## Credenciales de acceso

Los usuarios se crean automaticamente en `auth.db` la primera vez que arranca `auth-service`.

| Usuario | Contrasena | Nombre completo | Rol |
|---|---|---|---|
| `admin` | `Arca@2026!` | Administrador ARCA | Admin |
| `rrhh` | `Rrhh@2026!` | Gestor de Recursos Humanos | RRHH |
| `finanzas` | `Fin@2026!` | Analista de Finanzas | Finanzas |

> El token JWT dura **8 horas**. Al expirar, el sistema redirige al login automaticamente.

---

## Como ver las bases de datos

Cada servicio tiene su propio archivo SQLite. Se generan en la carpeta del proyecto al primer arranque.

| Servicio | Archivo | Ubicacion |
|---|---|---|
| auth-service | `auth.db` | `backend-services/auth-service/src/ARCA.Auth/` |
| employee-service | `employee.db` | `backend-services/employee-service/src/ARCA.Employee/` |
| vacation-service | `vacation.db` | `backend-services/vacation-service/src/ARCA.Vacation/` |
| contract-service | `contract.db` | `backend-services/contract-service/src/ARCA.Contract/` |
| payroll-service | `payroll.db` | `backend-services/payroll-service/src/ARCA.Payroll/` |

### Abrir con DB Browser for SQLite

1. Descarga gratuita: https://sqlitebrowser.org
2. **File → Open Database** → selecciona el archivo `.db`
3. Pestaña **"Browse Data"** → selecciona la tabla en el dropdown

### Tablas con datos reales por servicio

| Archivo `.db` | Tabla principal | Contiene |
|---|---|---|
| `auth.db` | `Users` | Usuarios del sistema con hash BCrypt |
| `employee.db` | `Employees` | Funcionarios (seed: 5 empleados) |
| `vacation.db` | `VacationBalances` | Saldos de vacaciones por empleado/gestion |
| `contract.db` | `ContractRecords` | Metadatos de contratos generados |
| `payroll.db` | `PayrollRecords` | Planillas con desglose AFP |

> La tabla `__EFMigrationsHistory` es interna de Entity Framework — no contiene datos de negocio.

---

## Como cerrar sesion

### Desde la aplicacion web

En el sidebar (panel izquierdo), clic en el icono de salida (**→|**) junto al nombre del usuario.

### Desde la API (Postman / cliente HTTP)

El sistema usa JWT stateless — no hay endpoint de logout en el servidor. El token invalida solo al expirar (8 horas). Para invalidar inmediatamente:

1. Elimina el token del almacenamiento local del navegador:
   - DevTools (`F12`) → **Application** → **Local Storage** → `http://localhost:5173`
   - Elimina las claves `arca_token` y `arca_user`
2. Recarga la pagina → redirige al login automaticamente

---

## Datos de prueba (seed)

Al primer `dotnet run`, los servicios insertan datos de muestra automaticamente:

### Empleados (employee-service)

| Nombre | CI | Area | Cargo | Salario | Ingreso |
|---|---|---|---|---|---|
| Ana Silva | 1234567 | Tecnologia | Desarrolladora Senior | Bs. 15,000 | 2023-03-15 |
| Carlos Mendoza | 2345678 | Finanzas | Analista Financiero | Bs. 8,000 | 2025-01-10 |
| Lucia Torres | 3456789 | RR.HH. | Gestora de Personal | Bs. 9,500 | 2022-08-01 |
| Marco Quispe | 4567890 | Tecnologia | Arquitecto de Software | Bs. 18,000 | 2021-05-20 |
| Sofia Romero | 5678901 | Comercial | Ejecutiva de Ventas | Bs. 7,500 | 2024-11-03 |

### Vacaciones (vacation-service)

Ejecutar `POST /api/vacations/calculate` para poblar. Resultado esperado con la fecha actual:

| Empleado | Elegible | Dias otorgados |
|---|---|---|
| Ana Silva | Si (3 anos) | 15 dias |
| Carlos Mendoza | Si (1 ano) | 15 dias |
| Lucia Torres | Si (3 anos) | 15 dias |
| Marco Quispe | Si (4 anos) | 15 dias |
| Sofia Romero | No (6 meses) | 0 dias |

### Planilla AFP (payroll-service)

Ejecutar `POST /api/payroll/generate` con `{ "year": 2026, "month": 5 }`. Descuento AFP 12.71% (D.S. 23570):

| Empleado | Salario Base | AFP (12.71%) | Liquido |
|---|---|---|---|
| Ana Silva | Bs. 15,000.00 | Bs. 1,906.50 | Bs. 13,093.50 |
| Carlos Mendoza | Bs. 8,000.00 | Bs. 1,016.80 | Bs. 6,983.20 |
| Lucia Torres | Bs. 9,500.00 | Bs. 1,207.45 | Bs. 8,292.55 |
| Marco Quispe | Bs. 18,000.00 | Bs. 2,287.80 | Bs. 15,712.20 |
| Sofia Romero | Bs. 7,500.00 | Bs. 953.25 | Bs. 6,546.75 |

---

## Solucion de problemas comunes

**Puerto ya en uso:**
```powershell
netstat -ano | findstr ":5001"
Stop-Process -Id <PID> -Force
```

O simplemente ejecuta `.\stop-arca.ps1` para liberar todos los puertos de una vez.

**payroll-service o vacation-service devuelven 503:**
Verifica que `employee-service` este corriendo en `:5001` antes de iniciarlos.

**Base de datos no tiene datos / aparece vacia:**
El seed se ejecuta al arrancar el servicio. Si el `.db` existe pero esta vacio, eliminalo y vuelve a ejecutar `dotnet run`:
```powershell
Remove-Item employee.db
dotnet run --launch-profile http
```

**El login devuelve error de conexion:**
`auth-service` debe estar corriendo en `:5000` antes de intentar iniciar sesion en el frontend.

**PDF de contrato no descarga en Postman:**
Usa **Send and Download** en lugar de **Send** para requests que devuelven archivos binarios.

---

## Estructura del proyecto

```
KATA-ARQUITECTONICO/
├── start-arca.ps1                    # Arranca todos los servicios
├── stop-arca.ps1                     # Detiene todos los servicios
├── frontend-react/                   # Aplicacion React + Vite + Zustand
└── backend-services/
    ├── auth-service/                 # JWT + BCrypt  :5000
    ├── employee-service/             # CRUD empleados  :5001
    ├── vacation-service/             # Saldos + ley boliviana  :5002
    ├── contract-service/             # Generacion PDF (QuestPDF)  :5003
    └── payroll-service/              # Planillas AFP 12.71%  :5004
```

Cada servicio sigue **Clean Architecture**: `Domain` → `Application` → `Infrastructure` → `API`.

---

*ARCA HR System — Kata Arquitectonico*
