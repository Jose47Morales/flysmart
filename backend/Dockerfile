FROM debian:bullseye-slim

RUN apt update && apt install -y \
  build-essential \
  cmake \
  git \
  curl \
  && apt clean

WORKDIR /app

COPY . .

RUN mkdir -p build && \
    g++ -std=c++17 -Iinclude src/*.cpp -o bin/flysmart

CMD [ "./backend/bin/flysmart" ]