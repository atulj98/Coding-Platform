FROM openjdk:17-jdk-slim

# Prevent interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install security updates and coreutils (which includes timeout)
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y --no-install-recommends coreutils && \
    rm -rf /var/lib/apt/lists/* && \
    apt-get clean

# Create non-root user
RUN groupadd -g 1001 coderunner && \
    useradd -r -u 1001 -g coderunner coderunner

WORKDIR /app

# Create writable directories for compilation and execution
RUN mkdir -p /app/code /app/temp /app/output && \
    chown -R coderunner:coderunner /app/code /app/temp /app/output && \
    chmod -R 755 /app/code /app/temp /app/output

# Set Java options for memory constraints and performance
ENV JAVA_OPTS="-Xmx128m -Xms32m -XX:+UseSerialGC -XX:MaxMetaspaceSize=64m"

# Make sure /app is accessible for bind mounts
RUN chmod 755 /app

# Switch to root user for execution (container will be isolated anyway)
USER root

# Keep container running for exec commands
CMD ["sleep", "infinity"]