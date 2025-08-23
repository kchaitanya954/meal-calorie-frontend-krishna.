# Dev Dockerfile (Vercel will build separately)
FROM node:20-alpine
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY package*.json ./
RUN npm install

COPY . .
# ensure .env.local is present at runtime via docker-compose envs; not copying secrets

EXPOSE 3000
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0"]

