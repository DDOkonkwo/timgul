# Build Timgul Android dev client
# Run from timgul folder: .\scripts\build-android.ps1

$ErrorActionPreference = "Stop"

$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:ANDROID_HOME = if ($env:ANDROID_HOME) { $env:ANDROID_HOME } else { "C:\AndroidSDK" }
$env:GRADLE_USER_HOME = "C:\gradle"
$env:PATH = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:PATH"

New-Item -ItemType Directory -Path $env:GRADLE_USER_HOME -Force | Out-Null

Write-Host "JAVA_HOME: $env:JAVA_HOME"
Write-Host "ANDROID_HOME: $env:ANDROID_HOME"
Write-Host "GRADLE_USER_HOME: $env:GRADLE_USER_HOME"

Push-Location android
try {
  .\gradlew.bat assembleDebug -PreactNativeArchitectures=x86_64 --no-daemon
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
} finally {
  Pop-Location
}

Write-Host "APK built at android\app\build\outputs\apk\debug\app-debug.apk"
node .\scripts\install-all-android.mjs
