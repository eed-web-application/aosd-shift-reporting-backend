# Specify the base image. You can choose the version of Node.js that suits your application.
FROM node:21

# Install tini
RUN apt-get update && apt-get install -y tini

# Set the working directory inside the Docker container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) into the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY src/ ./src/
COPY test/ ./test/

# Expose the port your app runs on
EXPOSE 3000

# Use tini as the entry-point to manage signals
ENTRYPOINT ["/usr/bin/tini", "--"]

# Command to run your app. Adjust the start script according to your package.json
CMD ["npm", "start"]
