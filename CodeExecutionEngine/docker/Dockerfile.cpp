FROM ubuntu:22.04

# Prevent interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install GCC and other utilities
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    g++ \
    coreutils \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Create non-root user (but we'll use root for execution)
RUN groupadd -g 1001 coderunner && \
    useradd -r -u 1001 -g coderunner coderunner

WORKDIR /app

# Make sure /app is accessible and executable
RUN chmod 755 /app

# Set compiler flags for security and optimization
ENV CXXFLAGS="-O2 -Wall -Wextra -std=c++17"

# Use root for execution to avoid permission issues
USER root

# Keep container running for exec commands
CMD ["sleep", "infinity"]
