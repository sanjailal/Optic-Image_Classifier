FROM node:16.13.1

WORKDIR /usr/src/app 

COPY ./package.json ./

COPY ./package-lock.json ./

RUN npm install 

COPY . .

EXPOSE 8080

ENTRYPOINT [ "npm" ]

CMD ["start"]