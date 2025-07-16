# Use an official Node.js runtime as a parent image
# Using Alpine Linux for a smaller image size
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or npm-shrinkwrap.json)
# This step is done separately to leverage Docker's layer caching.
# If these files haven't changed, Docker can reuse the layer from a previous build.
COPY package*.json ./

# Install app dependencies
# Using --only=production to install only production dependencies
RUN npm ci --only=production

# Bundle app source (ensure your 'public' directory with admin.html and adminJS.js is here)
COPY . .

# Your application binds to a port, make sure to expose it
# The default is 3000 from your CONVERTOAPI.js, but it can be overridden by PORT env var.
# This EXPOSE instruction is documentation; you still need to map it with -p when running.
EXPOSE 3000

# Define environment variables
# NODE_ENV is important for Koa and other libraries to optimize for production.
ENV NODE_ENV=production
# PORT can be set here as a default, or overridden at runtime.
ENV PORT=3000

# Define the command to run your app
CMD [ "node", "CONVERTOAPI.js" ]