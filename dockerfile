# node image version
FROM node:22-alpine

# open folder in docker 
WORKDIR /auth-project

# Install pnpm globally
RUN npm install -g pnpm

# copy package.json file
COPY package*.json ./

COPY pnpm-lock.yaml ./
# install all packages
RUN pnpm install

# copy other files
COPY . .

# port
EXPOSE 3000

# command which will run app
CMD [ "pnpm", "dev" ]