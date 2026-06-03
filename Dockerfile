FROM node:24-alpine

USER node

WORKDIR /app

ENV PATH=/app/node_modules/.bin:$PATH

RUN chown node:node /app

COPY --chown=node:node package.json ./
COPY --chown=node:node package-lock.json ./

RUN npm install

COPY --chown=node:node . ./

RUN npm run build

CMD ["sh", "-c", "/app/entrypoint.sh" ]
