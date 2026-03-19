$file = "c:\Users\NEW MULI COMPUER\Desktop\myconverter\src\Components\Pages\PrivacyPolicy.js"
$content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

# UTF-8 bytes of each char were mis-read as Windows-1252 single chars, then re-saved as UTF-8.
# Correct CP1252 mapped codepoints (per WHATWG CP1252 table):
#   0x80 -> U+20AC (euro)   0x86 -> U+2020 (dagger)  0x89 -> U+2030 (per-mille)
#   0x92 -> U+2019 (rsquo)  0x94 -> U+201D (rdquo)   0x98 -> U+02DC (tilde)
#   0x99 -> U+2122 (trade)  0x9C -> U+0153 (oe lig)

# em-dash U+2014  (UTF-8: E2 80 94) → CP1252: â(00E2) €(20AC) "(201D)
$content = $content.Replace([string][char]0x00E2 + [char]0x20AC + [char]0x201D, [string][char]0x2014)
# right arrow U+2192  (UTF-8: E2 86 92) → CP1252: â(00E2) †(2020) '(2019)
$content = $content.Replace([string][char]0x00E2 + [char]0x2020 + [char]0x2019, [string][char]0x2192)
# less-than-or-equal U+2264  (UTF-8: E2 89 A4) → CP1252: â(00E2) ‰(2030) ¤(00A4)
$content = $content.Replace([string][char]0x00E2 + [char]0x2030 + [char]0x00A4, [string][char]0x2264)
# right single quote U+2019  (UTF-8: E2 80 99) → CP1252: â(00E2) €(20AC) ™(2122)
$content = $content.Replace([string][char]0x00E2 + [char]0x20AC + [char]0x2122, [string][char]0x2019)
# left single quote U+2018  (UTF-8: E2 80 98) → CP1252: â(00E2) €(20AC) ˜(02DC)
$content = $content.Replace([string][char]0x00E2 + [char]0x20AC + [char]0x02DC, [string][char]0x2018)
# left double quote U+201C  (UTF-8: E2 80 9C) → CP1252: â(00E2) €(20AC) œ(0153)
$content = $content.Replace([string][char]0x00E2 + [char]0x20AC + [char]0x0153, [string][char]0x201C)
# section sign U+00A7  (UTF-8: C2 A7) → CP1252: Â(00C2) §(00A7)
$content = $content.Replace([string][char]0x00C2 + [char]0x00A7, [string][char]0x00A7)
# non-breaking space U+00A0  (UTF-8: C2 A0) → CP1252: Â(00C2) nbsp(00A0)
$content = $content.Replace([string][char]0x00C2 + [char]0x00A0, [string][char]0x00A0)

[System.IO.File]::WriteAllText($file, $content, [System.Text.Encoding]::UTF8)
Write-Host "Encoding fix complete. Total lines: $($content.Split("`n").Count)"
