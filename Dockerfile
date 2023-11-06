# Use an official Node runtime as a base image
FROM node:14-slim

# Set the working directory in the container to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app/

# Install any needed packages specified in package.json
RUN npm install

# Build the app
RUN npm run build

# Install serve package globally to serve the static files
RUN npm install -g serve

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Run serve when the container launches
CMD ["serve", "-s", "build", "-l", "5000"]
