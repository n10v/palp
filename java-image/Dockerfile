FROM ubuntu:latest

RUN set -x && \
  apt-get -y update && \
  apt-get install -y openjdk-8-jdk && \
  apt-get clean

ADD palp-compile /palp-compile
RUN chmod +x /palp-compile

ADD palp-run /palp-run
RUN chmod +x /palp-run
