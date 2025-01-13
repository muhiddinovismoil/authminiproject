# =============================================================================================
# FULL VERSION DOCKER     == on my project full dockerfile version  382 mb
# =============================================================================================
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


# =============================================================================================
# MEMORY OPTIMIZED VERION       ==   on my project optimized dockerfile version 287mb
# =============================================================================================

# node image version optimized version
# FROM node:22-alpine

# working directory
# WORKDIR /auth-project

# copy package.json and lockfile
# COPY package*.json pnpm-lock.yaml ./

# Install pnpm globally and intalling packages where only dependencies
# RUN npm install -g pnpm && pnpm install --frozen-lockfile --prod

# copy the rest of the application files
# COPY . .

# Expose the application port
# EXPOSE 3000

# Run the application
# CMD [ "pnpm", "dev" ]
