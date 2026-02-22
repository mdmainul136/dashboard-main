$dir = "e:\Mern Stact Dev\multi-tenant-mern\dashboard-main\src\app\ior"
$files = Get-ChildItem -Path $dir -Recurse -Filter "page.tsx"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $original = $content

    # Fix bg-white for standalone backgrounds (not white/opacity which are for overlays)
    # bg-white used as card/container backgrounds -> bg-card
    $content = $content -replace 'bg-white"', 'bg-card"'
    $content = $content -replace 'bg-white ', 'bg-card '
    
    # data-[state=active]:bg-white -> data-[state=active]:bg-card
    $content = $content -replace 'data-\[state=active\]:bg-white', 'data-[state=active]:bg-card'
    
    # group-hover:bg-white -> group-hover:bg-card
    $content = $content -replace 'group-hover:bg-white', 'group-hover:bg-card'
    
    # hover:bg-white -> hover:bg-card  (but not hover:bg-white/x which is opacity)
    $content = $content -replace 'hover:bg-white"', 'hover:bg-card"'
    $content = $content -replace 'hover:bg-white ', 'hover:bg-card '

    # border-white/50 -> border-border (for border on light backgrounds)
    $content = $content -replace 'border-white/50', 'border-border'

    if ($content -ne $original) {
        Set-Content $file.FullName $content -NoNewline
        Write-Host "Updated: $($file.FullName)"
    } else {
        Write-Host "No changes: $($file.FullName)"
    }
}

Write-Host "`nDone!"
