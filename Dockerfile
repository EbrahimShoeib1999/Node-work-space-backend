# Use an official Node.js base image
FROM node:18

# Install PostgreSQL
RUN apt-get update && apt-get install -y postgresql postgresql-contrib

# Set environment variables for PostgreSQL
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=8291917Mn
ENV POSTGRES_DB=workspace

# Create a directory for the database
RUN mkdir -p /var/lib/postgresql/data

# Set the working directory inside the container
WORKDIR /app

# Copy the backend project files into the container
COPY . .

# Install dependencies
RUN npm install

# Expose the ports for the backend and PostgreSQL
EXPOSE 3000 5432

# Command to start PostgreSQL, run Sequelize migrations, and start the app
CMD service postgresql start && \
    npx sequelize-cli db:migrate && \
    npm start
