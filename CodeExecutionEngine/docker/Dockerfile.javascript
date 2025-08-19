FROM node:18-slim

# Prevent interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install security updates and coreutils
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y --no-install-recommends coreutils && \
    rm -rf /var/lib/apt/lists/* && \
    apt-get clean

# Create non-root user
RUN groupadd -g 1001 coderunner && \
    useradd -r -u 1001 -g coderunner coderunner

WORKDIR /app

# Make sure /app is accessible for bind mounts
RUN chmod 755 /app

# Set Node.js environment
ENV NODE_ENV=production

# Use root for execution
USER root

# Keep container running for exec commands
CMD ["sleep", "infinity"]
CMD ["sleep", "infinity"]
