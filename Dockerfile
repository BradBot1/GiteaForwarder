FROM node:16-alpine

RUN apk update
RUN apk add git
RUN apk add --update --no-cache openssh-client 

RUN mkdir -p -m 0700 ~/.ssh
RUN ssh-keyscan github.com >> ~/.ssh/known_hosts
RUN ssh-keyscan git.bb1.fun >> ~/.ssh/known_hosts
RUN ssh-keyscan gitlab.com >> ~/.ssh/known_hosts
RUN ssh-keyscan bitbucket.org >> ~/.ssh/known_hosts
RUN ssh-keyscan codeberg.org >> ~/.ssh/known_hosts
#RUN eval `ssh-agent -s`
WORKDIR /usr/app

RUN apk add --no-cache libc6-compat 
RUN ln -s /lib/libc.musl-x86_64.so.1 /lib/ld-linux-x86-64.so.2

COPY ./ ./

RUN npm install
RUN npm run build
RUN rm ./src/ -fr
RUN rm tsconfig.json

RUN chmod +x ./start.sh

ENTRYPOINT [ "./start.sh" ]