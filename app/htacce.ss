#RewriteEngine On
#RewriteCond %{HTTP_HOST} ^www.sitename\.ru$ [NC]
#RewriteRule ^(.*)$ http://sitename.ru/$1 [R=301,L] 

<ifModule mod_deflate.c>
AddOutputFilterByType DEFLATE text/html text/plain text/xml application/xml application/xhtml+xml text/css text/javascript application/javascript application/x-javascript
</ifModule>

<ifModule mod_headers.c>
	#кэшировать html и htm файлы на один день
	<FilesMatch "\.(html|htm)$">
		Header set Cache-Control "max-age=43200"
	</FilesMatch>
	#кэшировать css, javascript и текстовые файлы на одну неделю
	<FilesMatch "\.(js|css|txt)$">
		Header set Cache-Control "max-age=604800"
	</FilesMatch>
	#кэшировать флэш и изображения на месяц
	<FilesMatch "\.(flv|swf|ico|gif|jpg|jpeg|png)$">
		Header set Cache-Control "max-age=2592000"
	</FilesMatch>
	#отключить кэширование
	<FilesMatch "\.(pl|php|cgi|spl|scgi|fcgi)$">
		Header unset Cache-Control
	</FilesMatch>
</IfModule>

<ifModule mod_expires.c>

# Add correct content-type for fonts
AddType application/vnd.ms-fontobject .eot
AddType application/x-font-ttf .ttf
AddType application/x-font-opentype .otf
AddType application/x-font-woff .woff
AddType application/x-font-woff .woff2
AddType image/svg+xml .svg

# Compress compressible fonts
AddOutputFilterByType DEFLATE application/x-font-ttf application/x-font-opentype image/svg+xml

ExpiresActive On
#по умолчанию кеш в 5 секунд
ExpiresDefault "access plus 5 seconds"

# Images
ExpiresByType image/x-icon "access plus 7 days"
ExpiresByType image/jpeg "access plus 7 days"
ExpiresByType image/png "access plus 7 days"
ExpiresByType image/gif "access plus 7 days"
ExpiresByType image/svg+xml "access plus 7 days"
ExpiresByType application/x-shockwave-flash "access plus 7 days"
ExpiresByType image/vnd.microsoft.icon "access plus 7 days"

# CSS, javascript and text
ExpiresByType text/css "access plus 7 days"
ExpiresByType text/javascript "access plus 7 days"
ExpiresByType application/javascript "access plus 7 days"
ExpiresByType application/x-javascript "access plus 7 days"

# html, htm
ExpiresByType text/html "access plus 1 day"

# xml
ExpiresByType application/xhtml+xml "access plus 10 minutes"

# Fonts
ExpiresByType application/x-font-ttf "access plus 1 month"
ExpiresByType application/font-woff "access plus 1 month"
ExpiresByType application/x-font-woff "access plus 1 month"
ExpiresByType font/woff "access plus 1 month"
ExpiresByType application/font-woff2 "access plus 1 month"
ExpiresByType application/vnd.ms-fontobject "access plus 1 month"
ExpiresByType application/x-font-opentype "access plus 1 month"
ExpiresByType font/opentype "access plus 1 month"

</ifModule>