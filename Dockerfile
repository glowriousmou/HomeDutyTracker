FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm install -g @angular/cli json-server
# COPY db.json  /app/db.json
RUN ng build --configuration production
EXPOSE 4200 3000
CMD ["sh", "-c", "ng serve --host 0.0.0.0 --port 4200 & json-server --watch /app/db.json --port 3000 --host 0.0.0.0"]
#CMD ["sh", "-c", "ng serve & json-server --watch /app/db.json"]
