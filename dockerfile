FROM node:25.1.0
WORKDIR /app
COPY packgake.json /app
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm", "run", "dev" ]
