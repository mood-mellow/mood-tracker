# Dockerfile
FROM node:22

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy rest of app
COPY . .

# Expose port
EXPOSE 3000 6006

# Start dev server
CMD ["npm", "run", "dev"]
