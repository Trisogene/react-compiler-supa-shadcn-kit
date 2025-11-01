# Script per fermare tutti i servizi
# Uso: .\stop-dev.ps1

Write-Host "Arresto servizi..." -ForegroundColor Yellow
Write-Host ""

# Ferma Supabase
Write-Host "Arresto Supabase..." -ForegroundColor Yellow
npx supabase stop

Write-Host ""
Write-Host "Tutti i servizi sono stati fermati" -ForegroundColor Green
