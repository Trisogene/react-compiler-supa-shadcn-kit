# Script per avviare il progetto completo
# Uso: .\start-dev.ps1 o pnpm run dev

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   React19 + Supabase Kit - Dev Mode" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Verifica Docker
Write-Host "[1/4] Verifica Docker..." -ForegroundColor Yellow
$dockerRunning = docker info 2>$null
if (-not $dockerRunning) {
    Write-Host "[ERROR] Docker non e' in esecuzione!" -ForegroundColor Red
    Write-Host "        Per favore avvia Docker Desktop e riprova." -ForegroundColor Red
    Write-Host ""
    exit 1
}
Write-Host "[OK] Docker e' in esecuzione" -ForegroundColor Green
Write-Host ""

# Controlla se Supabase e' gia' in esecuzione
Write-Host "[2/4] Verifica stato Supabase..." -ForegroundColor Yellow
$supabaseAlreadyRunning = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:54321/rest/v1/" -Method GET -TimeoutSec 2 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        $supabaseAlreadyRunning = $true
        Write-Host "[OK] Supabase e' gia' in esecuzione" -ForegroundColor Green
    }
} catch {
    # Supabase non e' in esecuzione
}

if (-not $supabaseAlreadyRunning) {
    Write-Host "[2/4] Avvio Supabase locale..." -ForegroundColor Yellow
    Write-Host "      (Questo potrebbe richiedere alcuni minuti la prima volta)" -ForegroundColor Gray
    Write-Host ""
    
    # Avvia Supabase in background
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "npx supabase start"
    
    # Attendi che Supabase sia pronto
    Write-Host "      Attendo che Supabase sia pronto..." -ForegroundColor Yellow
    $maxAttempts = 30
    $attempt = 0
    $supabaseReady = $false
    
    while ($attempt -lt $maxAttempts -and -not $supabaseReady) {
        Start-Sleep -Seconds 2
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:54321/rest/v1/" -Method GET -TimeoutSec 2 -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200) {
                $supabaseReady = $true
            }
        } catch {
            $attempt++
            Write-Host "." -NoNewline -ForegroundColor Gray
        }
    }
    
    Write-Host ""
    if ($supabaseReady) {
        Write-Host "[OK] Supabase e' pronto!" -ForegroundColor Green
    } else {
        Write-Host "[WARN] Timeout in attesa di Supabase. Controlla i log." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "[3/4] URLs Disponibili:" -ForegroundColor Cyan
Write-Host "      - Supabase Studio: http://localhost:54323" -ForegroundColor White
Write-Host "      - Supabase API:    http://localhost:54321" -ForegroundColor White
Write-Host ""

# Avvia il frontend
Write-Host "[4/4] Avvio frontend React..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "pnpm dev"

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "           Tutto e' pronto!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend:        http://localhost:5173" -ForegroundColor Cyan
Write-Host "Supabase Studio: http://localhost:54323" -ForegroundColor Cyan
Write-Host ""
Write-Host "Per fermare i servizi, esegui: pnpm run stop" -ForegroundColor Yellow
Write-Host ""
