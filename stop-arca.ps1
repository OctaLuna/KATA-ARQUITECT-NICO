#Requires -Version 5.1
<#
.SYNOPSIS
    Detiene todos los microservicios ARCA HR liberando los puertos correspondientes.
.EXAMPLE
    .\stop-arca.ps1
#>

$ports = @(
    @{ port = 5000; label = "auth-service    " },
    @{ port = 5001; label = "employee-service" },
    @{ port = 5002; label = "vacation-service" },
    @{ port = 5003; label = "contract-service" },
    @{ port = 5004; label = "payroll-service " },
    @{ port = 5173; label = "frontend        " }
)

Write-Host ""
Write-Host "  Deteniendo servicios ARCA HR..." -ForegroundColor Yellow
Write-Host ""

$stopped = 0

foreach ($entry in $ports) {
    $port  = $entry.port
    $label = $entry.label

    $lines = netstat -ano 2>$null |
             Select-String "^\s+TCP\s+.*:$port\s+.*LISTENING"

    if (-not $lines) {
        Write-Host "  -  $label :$port  -> no estaba en uso" -ForegroundColor DarkGray
        continue
    }

    foreach ($line in $lines) {
        $pid_val = ($line.ToString().Trim() -split '\s+')[-1]
        if ($pid_val -notmatch '^\d+$' -or $pid_val -eq '0') { continue }

        $proc = Get-Process -Id $pid_val -ErrorAction SilentlyContinue
        if ($proc) {
            Stop-Process -Id $pid_val -Force -ErrorAction SilentlyContinue
            Write-Host "  OK $label :$port  -> PID $pid_val ($($proc.Name)) detenido" -ForegroundColor Green
            $stopped++
        }
    }
}

Write-Host ""
if ($stopped -gt 0) {
    Write-Host "  $stopped proceso(s) detenido(s)." -ForegroundColor Cyan
} else {
    Write-Host "  Ningun servicio ARCA estaba activo." -ForegroundColor DarkGray
}
Write-Host ""
