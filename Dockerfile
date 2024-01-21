# TODO: UPDATE ME
# FIXME: UPDATE ME
FROM nginx:alpine

RUN echo "Hello, Docker!" > /usr/share/nginx/html/index.html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;", "-c", "/etc/nginx/nginx.conf", "-p", "/usr/share/nginx"]