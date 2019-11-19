FROM openjdk:11.0-jre-slim

COPY entrypoint.sh /entrypoint.sh
RUN apt update && apt-get -y install bash curl


ENTRYPOINT ["/entrypoint.sh"]
