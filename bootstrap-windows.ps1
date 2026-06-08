<#
  bootstrap-windows.ps1
  - Detects Node.js installation and version (requires >=18)
  - Initializes project (npm init -y) if package.json missing
  - Installs required dependencies/devDependencies
  - Ensures Tailwind config (npx tailwindcss init -p) if missing

  Usage: run from project root in PowerShell or call bootstrap.cmd
#>

Write-Host "Happy Birthday Khushi — Bootstrap starting" -ForegroundColor Cyan

function AbortWithMessage($msg){
  Write-Host $msg -ForegroundColor Red
  exit 1
}

# Check node
try{
  $node = (& node -v) 2>$null
  if(-not $node){
    AbortWithMessage("Node.js not found. Please install Node.js LTS (recommended >=18.x). See https://nodejs.org/")
  }
} catch {
  AbortWithMessage("Node.js not found. Please install Node.js LTS (recommended >=18.x). See https://nodejs.org/")
}

$nodeVer = $node.Trim()
Write-Host "Detected Node version: $nodeVer" -ForegroundColor Green
try{
  $ver = $nodeVer.TrimStart('v')
  $major = [int]($ver.Split('.')[0])
} catch {
  AbortWithMessage("Unable to parse Node.js version. Please ensure Node.js >= 18 is installed.")
}

if ($major -lt 18){
  AbortWithMessage("Node.js version is older than 18.x. Please upgrade to Node.js >=18 LTS. Recommended: install from https://nodejs.org/ or run 'winget install OpenJS.NodeJS.LTS'.")
}

Write-Host "Node.js version is OK." -ForegroundColor Green

# Ensure npm available
try{ $npmVer = (& npm -v).Trim() } catch { AbortWithMessage("npm not found. Install Node.js which includes npm.") }
Write-Host "npm version: $npmVer" -ForegroundColor Green

# Work from script directory (project root assumed)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $scriptDir

if (-not (Test-Path -Path "package.json")){
  Write-Host "No package.json found — initializing project and installing dependencies..." -ForegroundColor Cyan
  npm init -y

  Write-Host "Installing runtime dependencies: react react-dom framer-motion react-icons" -ForegroundColor Cyan
  npm install react react-dom framer-motion react-icons

  Write-Host "Installing devDependencies: vite tailwindcss postcss autoprefixer @vitejs/plugin-react" -ForegroundColor Cyan
  npm install -D vite tailwindcss postcss autoprefixer @vitejs/plugin-react

  Write-Host "Creating Tailwind config (tailwind.config.cjs)" -ForegroundColor Cyan
  npx tailwindcss init -p
} else {
  Write-Host "package.json found — running npm install" -ForegroundColor Cyan
  npm install

  if (-not (Test-Path -Path "tailwind.config.cjs" -PathType Leaf -ErrorAction SilentlyContinue) -and -not (Test-Path -Path "tailwind.config.js" -PathType Leaf -ErrorAction SilentlyContinue)){
    Write-Host "Tailwind config not found — creating..." -ForegroundColor Cyan
    npx tailwindcss init -p
  }
}

Write-Host "\nBootstrap finished successfully." -ForegroundColor Green
Write-Host "Commands you can run now:" -ForegroundColor Yellow
Write-Host "  npm run dev    # start dev server" -ForegroundColor White
Write-Host "  npm run build  # build for production" -ForegroundColor White

Write-Host "\nPlace your images and audio here (example):" -ForegroundColor Cyan
Write-Host "  public/assets/khushi1.jpg" -ForegroundColor Green
Write-Host "  public/assets/khushi2.jpg" -ForegroundColor Green
Write-Host "  public/assets/khushi3.jpg" -ForegroundColor Green
Write-Host "  public/assets/khushi4.jpg" -ForegroundColor Green
Write-Host "  public/assets/khushi5.jpg" -ForegroundColor Green
Write-Host "  public/assets/piano.mp3" -ForegroundColor Green

Write-Host "\nVerify Node and npm installation:" -ForegroundColor Cyan
Write-Host "  node -v" -ForegroundColor White
Write-Host "  npm -v" -ForegroundColor White

exit 0
