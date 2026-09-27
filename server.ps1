$port = 3000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Web server is running stably at http://localhost:$port/"
Write-Host "To stop the server, press Ctrl+C"

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".png"  = "image/png"
    ".gif"  = "image/gif"
    ".mp3"  = "audio/mpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        try {
            $request = $context.Request
            $response = $context.Response

            $urlPath = $request.Url.LocalPath
            if ($urlPath -eq "/" -or [string]::IsNullOrWhiteSpace($urlPath) -or $urlPath -eq "/index.html" -or $urlPath -eq "/home.html") {
                $urlPath = "/preview.html"
            }
            if ($urlPath -eq "/style.css") {
                $urlPath = "/preview.css"
            }

            $cleanPath = $urlPath.TrimStart('/').Replace('/', '\')
            $localFilePath = Join-Path $PSScriptRoot $cleanPath

            if (Test-Path $localFilePath -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($localFilePath).ToLower()
                $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
                $response.ContentType = $contentType
                $response.Headers.Add("Cache-Control", "no-cache, no-store, must-revalidate")
                $response.Headers.Add("Pragma", "no-cache")
                $response.Headers.Add("Expires", "0")
                
                $bytes = [System.IO.File]::ReadAllBytes($localFilePath)
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $response.StatusCode = 404
                $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                $response.ContentLength64 = $msg.Length
                $response.OutputStream.Write($msg, 0, $msg.Length)
            }
        } catch {
            # Bỏ qua lỗi khi trình duyệt đóng kết nối sớm
        } finally {
            try { $context.Response.Close() } catch {}
        }
    }
} finally {
    try { $listener.Stop() } catch {}
}
