FROM ubuntu:22.04

# Prevent interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install GCC and other utilities
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    coreutils \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Create non-root user
RUN groupadd -g 1001 coderunner && \
    useradd -r -u 1001 -g coderunner coderunner

WORKDIR /app

# Make sure /app is accessible for bind mounts
RUN chmod 755 /app

# Set compiler flags
ENV CFLAGS="-O2 -Wall -Wextra -std=c17"

# Use root for execution
USER root

# Keep container running for exec commands
CMD ["sleep", "infinity"]
