param(
    [int]$Port = 8080
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootFull = [System.IO.Path]::GetFullPath($root + [System.IO.Path]::DirectorySeparatorChar)
$listener = $null

function Get-MimeType {
    param([string]$Path)

    switch ([System.IO.Path]::GetExtension($Path).ToLowerInvariant()) {
        '.html'        { 'text/html; charset=utf-8' }
        '.htm'         { 'text/html; charset=utf-8' }
        '.css'         { 'text/css; charset=utf-8' }
        '.js'          { 'application/javascript; charset=utf-8' }
        '.json'        { 'application/json; charset=utf-8' }
        '.webmanifest' { 'application/manifest+json; charset=utf-8' }
        '.png'         { 'image/png' }
        '.jpg'         { 'image/jpeg' }
        '.jpeg'        { 'image/jpeg' }
        '.svg'         { 'image/svg+xml' }
        '.ico'         { 'image/x-icon' }
        '.txt'         { 'text/plain; charset=utf-8' }
        default        { 'application/octet-stream' }
    }
}

function Send-Response {
    param(
        [System.Net.Sockets.NetworkStream]$Stream,
        [int]$StatusCode,
        [string]$StatusText,
        [byte[]]$Body,
        [string]$ContentType = 'text/plain; charset=utf-8',
        [bool]$HeadOnly = $false
    )

    $headers = @(
        "HTTP/1.1 $StatusCode $StatusText",
        "Content-Type: $ContentType",
        "Content-Length: $($Body.Length)",
        'Cache-Control: no-cache',
        'Connection: close',
        '',
        ''
    ) -join "`r`n"

    $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($headers)
    $Stream.Write($headerBytes, 0, $headerBytes.Length)

    if (-not $HeadOnly -and $Body.Length -gt 0) {
        $Stream.Write($Body, 0, $Body.Length)
    }

    $Stream.Flush()
}

try {
    $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $Port)
    $listener.Start()

    $url = "http://localhost:$Port"
    Write-Host ''
    Write-Host 'Karate & Azure Progress Hub is running.' -ForegroundColor Green
    Write-Host "Open: $url"
    Write-Host 'Keep this window open while using the app.'
    Write-Host 'Press Ctrl+C to stop the local server.'
    Write-Host ''

    Start-Process $url

    while ($true) {
        $client = $listener.AcceptTcpClient()

        try {
            $stream = $client.GetStream()
            $reader = [System.IO.StreamReader]::new(
                $stream,
                [System.Text.Encoding]::ASCII,
                $false,
                4096,
                $true
            )

            $requestLine = $reader.ReadLine()
            if ([string]::IsNullOrWhiteSpace($requestLine)) {
                continue
            }

            do {
                $line = $reader.ReadLine()
            } while ($null -ne $line -and $line -ne '')

            $parts = $requestLine.Split(' ')
            if ($parts.Length -lt 2) {
                $body = [System.Text.Encoding]::UTF8.GetBytes('Bad request')
                Send-Response -Stream $stream -StatusCode 400 -StatusText 'Bad Request' -Body $body
                continue
            }

            $method = $parts[0].ToUpperInvariant()
            $headOnly = $method -eq 'HEAD'
            if ($method -ne 'GET' -and -not $headOnly) {
                $body = [System.Text.Encoding]::UTF8.GetBytes('Method not allowed')
                Send-Response -Stream $stream -StatusCode 405 -StatusText 'Method Not Allowed' -Body $body
                continue
            }

            $requestTarget = ($parts[1] -split '\?')[0]
            $decodedPath = [System.Uri]::UnescapeDataString($requestTarget)
            if ($decodedPath -eq '/') {
                $decodedPath = '/index.html'
            }

            $relativePath = $decodedPath.TrimStart('/').Replace('/', [System.IO.Path]::DirectorySeparatorChar)
            $fullPath = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($root, $relativePath))

            if (-not $fullPath.StartsWith($rootFull, [System.StringComparison]::OrdinalIgnoreCase)) {
                $body = [System.Text.Encoding]::UTF8.GetBytes('Forbidden')
                Send-Response -Stream $stream -StatusCode 403 -StatusText 'Forbidden' -Body $body
                continue
            }

            if ([System.IO.Directory]::Exists($fullPath)) {
                $fullPath = [System.IO.Path]::Combine($fullPath, 'index.html')
            }

            if (-not [System.IO.File]::Exists($fullPath)) {
                $body = [System.Text.Encoding]::UTF8.GetBytes('Not found')
                Send-Response -Stream $stream -StatusCode 404 -StatusText 'Not Found' -Body $body
                continue
            }

            $body = [System.IO.File]::ReadAllBytes($fullPath)
            $contentType = Get-MimeType -Path $fullPath
            Send-Response -Stream $stream -StatusCode 200 -StatusText 'OK' -Body $body -ContentType $contentType -HeadOnly $headOnly
        }
        catch {
            Write-Warning "Request failed: $($_.Exception.Message)"
        }
        finally {
            if ($null -ne $reader) { $reader.Dispose() }
            if ($null -ne $stream) { $stream.Dispose() }
            $client.Close()
        }
    }
}
catch {
    Write-Host ''
    Write-Host 'The local app could not be started.' -ForegroundColor Red
    Write-Host $_.Exception.Message
    Write-Host ''
    Write-Host "If port $Port is already in use, close the other server window and try again."
    Write-Host 'Press any key to close.'
    [void][System.Console]::ReadKey($true)
    exit 1
}
finally {
    if ($null -ne $listener) {
        $listener.Stop()
    }
}
