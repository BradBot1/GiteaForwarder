FROM node:alpine

RUN apk update
RUN apk add git
RUN apk add doas
RUN apk add --update --no-cache openssh-client 

RUN mkdir -p -m 0700 ~/.ssh
RUN ssh-keyscan github.com >> ~/.ssh/known_hosts
RUN ssh-keyscan git.bb1.fun >> ~/.ssh/known_hosts
RUN ssh-keyscan gitlab.com >> ~/.ssh/known_hosts
RUN ssh-keyscan bitbucket.org >> ~/.ssh/known_hosts
RUN ssh-keyscan codeberg.org >> ~/.ssh/known_hosts
#RUN eval `ssh-agent -s`
WORKDIR /usr/app

COPY ./ ./

RUN npm install
RUN npm run build
RUN rm ./src/ -fr
RUN rm tsconfig.json

RUN chmod +x ./start.sh

ENTRYPOINT [ "./start.sh" ]