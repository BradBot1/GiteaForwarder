#!/bin/sh

if ! [ -f "/root/.ssh/id_rsa.pub" ]; then
  echo "No key found, creating a new one!"
  ssh-keygen -t rsa -f ~/.ssh/id_rsa -q -P ""
  chmod 700 ~/.ssh/id_rsa
  chmod 700 ~/.ssh/id_rsa.pub
  echo "    IdentityFile ~/.ssh/id_rsa" >> /etc/ssh/ssh_config
  echo "Your new public key for this instance:"
  cat ~/.ssh/id_rsa.pub
fi

npm run start