#Requires -Version 5.1
<#
.SYNOPSIS
    Inicia todos los microservicios ARCA HR en ventanas separadas.
.DESCRIPTION
    Levanta auth, employee, vacation, contract, payroll (backend) y el frontend React.
    Espera entre servicios para respetar el orden de dependencias.
.EXAMPLE
    .\start-arca.ps1
#>

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

# Orden: auth primero, employee segundo (vacation y payroll lo consumen), resto al final
$services = @(
    [pscustomobject]@{
        label = "auth-service     :5000"
        path  = "$root\backend-services\auth-service\src\ARCA.Auth"
        cmd   = "dotnet run --launch-profile http"
        wait  = 6
    },
    [pscustomobject]@{
        label = "employee-service :5001"
        path  = "$root\backend-services\employee-service\src\ARCA.Employee"
        cmd   = "dotnet run --launch-profile http"
        wait  = 5
    },
    [pscustomobject]@{
        label = "vacation-service :5002"
        path  = "$root\backend-services\vacation-service\src\ARCA.Vacation"
        cmd   = "dotnet run --launch-profile http"
        wait  = 3
    },
    [pscustomobject]@{
        label = "contract-service :5003"
        path  = "$root\backend-services\contract-service\src\ARCA.Contract"
        cmd   = "dotnet run --launch-profile http"
        wait  = 3
    },
    [pscustomobject]@{
        label = "payroll-service  :5004"
        path  = "$root\backend-services\payroll-service\src\ARCA.Payroll"
        cmd   = "dotnet run --launch-profile http"
        wait  = 3
    },
    [pscustomobject]@{
        label = "frontend         :5173"
        path  = "$root\frontend-react"
        cmd   = "npm run dev"
        wait  = 0
    }
)

Write-Host ""
Write-Host "  +------------------------------------------+" -ForegroundColor Cyan
Write-Host "  |   ARCA HR - Sistema de Microservicios   |" -ForegroundColor Cyan
Write-Host "  +------------------------------------------+" -ForegroundColor Cyan
Write-Host ""

foreach ($svc in $services) {
    Write-Host "  >> $($svc.label)" -ForegroundColor Green

    $innerCmd = "`$host.UI.RawUI.WindowTitle = 'ARCA | $($svc.label)'; " +
                "Set-Location '$($svc.path)'; " +
                "$($svc.cmd)"

    Start-Process powershell -ArgumentList "-NoExit", "-Command", $innerCmd

    if ($svc.wait -gt 0) {
        Write-Host "     Esperando $($svc.wait)s..." -ForegroundColor DarkGray
        Start-Sleep -Seconds $svc.wait
    }
}

Write-Host ""
Write-Host "  Todos los servicios iniciando." -ForegroundColor Cyan
Write-Host ""
Write-Host "  ACCESOS:" -ForegroundColor White
Write-Host "    Frontend    ->  http://localhost:5173" -ForegroundColor Yellow
Write-Host "    Auth        ->  http://localhost:5000/swagger" -ForegroundColor Yellow
Write-Host "    Employees   ->  http://localhost:5001/swagger" -ForegroundColor Yellow
Write-Host "    Vacations   ->  http://localhost:5002/swagger" -ForegroundColor Yellow
Write-Host "    Contracts   ->  http://localhost:5003/swagger" -ForegroundColor Yellow
Write-Host "    Payroll     ->  http://localhost:5004/swagger" -ForegroundColor Yellow
Write-Host ""
Write-Host "  CREDENCIALES:" -ForegroundColor White
Write-Host "    admin    /  Arca@2026!   (Admin)" -ForegroundColor Gray
Write-Host "    rrhh     /  Rrhh@2026!   (RRHH)" -ForegroundColor Gray
Write-Host "    finanzas /  Fin@2026!    (Finanzas)" -ForegroundColor Gray
Write-Host ""
Write-Host "  Para detener todo: .\stop-arca.ps1" -ForegroundColor DarkGray
Write-Host ""
