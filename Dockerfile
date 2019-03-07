FROM nginx:1.14

COPY ./dist/ /usr/share/nginx/html/
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./run.sh /usr/share/run.sh

ENV TZ=Asia/Shanghai

RUN chmod +x /usr/share/run.sh 

EXPOSE 80

CMD /usr/share/run.sh && nginx -g 'daemon off;'