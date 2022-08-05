FROM node:lts

WORKDIR /app

COPY . .

RUN yarn

EXPOSE 3333

CMD [ "yarn", "dev" ]