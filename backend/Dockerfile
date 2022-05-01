FROM rust:1.56

RUN apt-get update

WORKDIR /var
RUN USER=root cargo new --bin backend
WORKDIR /var/backend

COPY ./Cargo.lock ./Cargo.lock
COPY ./Cargo.toml ./Cargo.toml
COPY ./Rocket.toml ./Rocket.toml
RUN cargo build --release

COPY ./src ./src
RUN cargo install --locked --path .

EXPOSE 8000
ENV PORT 8000
