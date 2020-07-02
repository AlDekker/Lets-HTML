#RewriteEngine On
#RewriteCond %{HTTP_HOST} ^www.sitename\.ru$ [NC]
#RewriteRule ^(.*)$ http://sitename.ru/$1 [R=301,L] 

# сжатие text, html, javascript, css, xml:
<ifModule mod_deflate.c>
<IfModule mod_filter.c>
AddOutputFilterByType DEFLATE text/plain text/html
AddOutputFilterByType DEFLATE text/css
AddOutputFilterByType DEFLATE text/javascript application/javascript application/x-javascript
AddOutputFilterByType DEFLATE text/xml application/xml application/xhtml+xml application/rss+xml
AddOutputFilterByType DEFLATE application/json
AddOutputFilterByType DEFLATE application/vnd.ms-fontobject application/x-font-ttf font/opentype image/svg+xml image/x-icon  </ifModule>
AddOutputFilterByType DEFLATE / x-font-ttf application / x-font-opentype image / svg + xml  
</ifModule>
</ifModule>

<IfModule mod_expires.c>
# Enable expires
ExpiresActive On

# Default a cache expiration
ExpiresDefault "access plus 10 month"

# Images
ExpiresByType image/gif "access plus 1 year"
ExpiresByType image/png "access plus 1 year"
ExpiresByType image/jpg "access plus 1 year"
ExpiresByType image/jpeg "access plus 1 year"

# CSS, JavaScript
ExpiresByType text/css "access plus 1 year"
ExpiresByType application/javascript "access plus 1 year"
ExpiresByType text/javascript "access plus 1 year"

# Fonts
# Add correct content-type for fonts
AddType application/vnd.ms-fontobject .eot 
AddType application/x-font-ttf .ttf
AddType application/x-font-opentype .otf
AddType application/x-font-woff .woff
AddType application/x-font-woff2 .woff2
AddType image/svg+xml .svg
 
# Compress compressible fonts
# only uncomment if you dont have compression turned on already. Otherwise it will cause all other filestypes not to get compressed
# AddOutputFilterByType DEFLATE application/x-font-ttf application/x-font-opentype image/svg+xml
 
ExpiresActive on
 
# Add a far future Expires header for fonts
ExpiresByType application/vnd.ms-fontobject "access plus 1 year"
ExpiresByType application/x-font-ttf "access plus 1 year"
ExpiresByType application/x-font-opentype "access plus 1 year"
ExpiresByType application/x-font-woff "access plus 1 year"
ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
 
<IfModule mod_headers.c>
    Header unset ETag
</IfModule>
FileETag None