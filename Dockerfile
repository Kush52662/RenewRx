FROM nginx:alpine

# Copy the mock sites to the Nginx html directory
COPY mock_sites /usr/share/nginx/html

# Copy a custom nginx config if needed, or rely on default.
# Default nginx serves from /usr/share/nginx/html.
# We want /portal to serve /usr/share/nginx/html/portal/index.html
# and /pharmacy to serve /usr/share/nginx/html/pharmacy/index.html

# The default config usually tries to find index.html in the requested directory.
# So requesting /portal/ should work.
# Requesting /portal (no slash) might need a redirect or standard handling.

# Let's ensure we expose the port Cloud Run expects (defaults to 8080 usually, but Nginx default is 80)
# Cloud Run sets the PORT env var. Nginx configuration needs to listen on that port.
# A simple template substitution script is often used, or we can just configure it to listen on 8080 and tell Cloud Run to use 8080.
# Easier: Just use 8080 in nginx config.

RUN echo "server { \
    listen 8080; \
    server_name localhost; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
    } \
}" > /etc/nginx/conf.d/default.conf

# Expose 8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
