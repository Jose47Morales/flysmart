FROM debian:bullseye as builder

RUN apt update && apt install -y build-essential cmake

WORKDIR /app

COPY include ./include
COPY src ./src

RUN g++ -std=c++17 -Iinclude src/*.cpp -o flysmart

FROM python:3.10-slim

WORKDIR /app

COPY . .

COPY --from=builder /app/flysmart /app/bin/flysmart

RUN pip install -r requirements.txt

ENV FLASK_APP=app.py

EXPOSE 5000

CMD ["flask", "run", "--host=0.0.0.0"]