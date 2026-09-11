@echo off
setlocal
cd /d "%~dp0"
echo Installing root dependencies...
npm install
if errorlevel 1 goto :error
echo Installing backend dependencies...
npm install --prefix backend
if errorlevel 1 goto :error
echo Installing frontend dependencies...
npm install --prefix frontend
if errorlevel 1 goto :error
echo Starting Spandana locally...
npm run dev
goto :eof
:error
echo.
echo Local setup failed. See the error above.
pause
