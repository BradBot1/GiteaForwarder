# Gitea Forwarder [![Build Status](https://ci.bb1.fun/api/badges/BradBot_1/GiteaForwarder/status.svg)](https://ci.bb1.fun/BradBot_1/GiteaForwarder) [![License](https://img.shields.io/github/license/BradBot1/Simple-Events.svg)](https://git.bb1.fun/BradBot_1/GiteaForwarder/src/branch/master/LICENSE)

A simple way to mirror repositories on gitea

## How to use

Just follow the [examples](#examples) detailed below

## Environment Variables

### `PORT`

> Given directly to [0http](https://github.com/BackendStack21/0http#usage)

The port to publish the application upon, defaults to 3000

### `SSL_CERT_PATH`

> Given directly to [low-http-server](https://github.com/jkyberneees/low-http-server#introduction)

The path to an ssl certificate, no default

### `SSL_KEY_PATH`

> Given directly to [low-http-server](https://github.com/jkyberneees/low-http-server#introduction)

The path to an ssl key, no default

### `SSL_PASSWORD`

> Given directly to [low-http-server](https://github.com/jkyberneees/low-http-server#introduction)

The password for the SSL certification, no default

### `DATA`

Environment version of [data.json](https://git.bb1.fun/BradBot_1/GiteaForwarder/src/branch/master/data.json), no default

## Examples

### Docker run

#### With an environment variable

```shell
docker run --name forwarder -e PORT=80 -e DATA='[{"origin":"https://git.example.com/user/repo","recipients":[{"modifyReadme":true,"url":"https://gitlab.com/user/repo","authors":[{"old":"user@example.com","email":"00000000+user@users.noreply.github.com","name":"user"}]}]}]' -p 80:80 -d bradbot1/gitea-forwarder
```

#### With a volume mount (preffered)

```shell
docker run --name forwarder -e PORT=80 -v ./data.json:./data.json -p 80:80 -d bradbot1/gitea-forwarder
```

You can find an example of [data.json here](https://git.bb1.fun/BradBot_1/GiteaForwarder/src/branch/master/data.json)

### Docker compose

#### With an environment variable

```yml
version: '3'

services:
  forwarder:
    image: bradbot1/gitea-forwarder
    ports:
      - '80:80'
    environment:
      PORT: 80
      DATA: '[{"origin":"https://git.example.com/user/repo","recipients":[{"url":"https://gitlab.com/user/repo","authors":[{"old":"user@example.com","email":"00000000+user@users.noreply.github.com","name":"user"}]}]}]'
```

#### With a volume mount (preffered)

```yml
version: '3'

services:
  forwarder:
    image: bradbot1/gitea-forwarder
    ports:
      - '80:80'
    environment:
      PORT: 80
    volumes:
      - ./data.json:./data.json
```
source: [docker-compose.yml](https://git.bb1.fun/BradBot_1/GiteaForwarder/src/branch/master/docker-compose.yml)

```json
[
 {
  "origin": "https://git.example.com/user/repo",
  "webhook": "CustomWebhookSlug",
  "recipients": [
   {
    "url": "https://gitlab.com/user/repo",
    "humanName": "An optional human name for logging",
    "authors": [
     {
      "old": "user@example.com",
      "email": "00000000+user@users.noreply.github.com",
      "name": "user"
     },
     {
      "old": "user2@example.com",
      "email": "00000001+user2@users.noreply.github.com",
      "name": "user2"
     }
    ],
    "modifyReadme": true
   }
  ]
 }
]
```
source: [data.json](https://git.bb1.fun/BradBot_1/GiteaForwarder/src/branch/master/data.json)