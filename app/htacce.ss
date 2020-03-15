#RewriteEngine On
#RewriteCond %{HTTP_HOST} ^www.sitename\.ru$ [NC]
#RewriteRule ^(.*)$ http://sitename.ru/$1 [R=301,L] 

# сжатие text, html, javascript, css, xml:
<ifModule mod_deflate.c>

# Add correct content-type for fonts
AddType application/vnd.ms-fontobject .eot
AddType application/x-font-ttf .ttf
AddType application/x-font-opentype .otf
AddType application/x-font-woff .woff
AddType application/font-woff2 .woff2
AddType image/svg+xml .svg

# Compress compressible fonts
AddOutputFilterByType DEFLATE application/x-font-ttf application/x-font-opentype image/svg+xml

</ifModule>

# кеш браузера
<ifModule mod_expires.c>
ExpiresActive On

#кеш по умолчанию
ExpiresDefault "access plus 86400 seconds"

# Включаем кэширование изображений и флэш
ExpiresByType image/x-icon "access plus 2592000 seconds"
ExpiresByType image/jpeg "access plus 2592000 seconds"
ExpiresByType image/png "access plus 2592000 seconds"
ExpiresByType image/gif "access plus 2592000 seconds"
ExpiresByType image/svg+xml "access plus 2592000 seconds"
ExpiresByType application/x-shockwave-flash "access plus 2592000 seconds"

# Включаем кэширование css, javascript и текстовых файлов
ExpiresByType text/css "access plus 604800 seconds"
ExpiresByType text/javascript "access plus 604800 seconds"
ExpiresByType application/javascript "access plus 604800 seconds"
ExpiresByType application/x-javascript "access plus 604800 seconds"

# Включаем кэширование html и htm файлов
ExpiresByType text/html "access plus 600 seconds"

# Включаем кэширование xml файлов
ExpiresByType application/xhtml+xml "access plus 600 seconds"

# Нестандартные шрифты сайта
ExpiresByType application/x-font-ttf "access plus 10368000 seconds"
ExpiresByType application/x-font-woff "access plus 10368000 seconds"
ExpiresByType application/vnd.ms-fontobject "access plus 10368000 seconds"
ExpiresByType application/x-font-opentype "access plus 10368000 seconds"
ExpiresByType font/opentype "access plus 10368000 seconds"
ExpiresByType image/svg+xml "access plus 10368000 seconds"

</ifModule>