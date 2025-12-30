FROM node:25.1.0
WORKDIR /app
COPY packgake.json /app
RUN npm install
COPY . .
CMD [ "npm", "run", "dev" ]
