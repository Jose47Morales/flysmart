FROM debian:bullseye as builder

RUN apt update && apt insatll -y build-essential cmake

WORKDIR /app

COPY . .

RUN mkdir -p build && \
    g++ -std=c++17 -Iinclude backend/src/*.cpp -o backend/bin/flysmart

FROM python:3.10-slim

RUN pip install -r backend/requirements.txt

WORKDIR /app

COPY --from=builder /app/backend /app/backend

EXPOSE 5000

CMD ["python", "backend/app.py"]