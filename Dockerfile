FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app /app
EXPOSE 3000
CMD ["npm", "run", "prod"]
