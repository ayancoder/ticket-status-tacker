# ticket-status-tacker
# install mongo
brew install mongodb-community@5.0

# to make mongo run on start
To have launchd start mongodb/brew/mongodb-community now and restart at login:
  brew services start mongodb/brew/mongodb-community
Or, if you don't want/need a background service you can just run:
  mongod --config /usr/local/etc/mongod.conf

#kill already running node process.
sudo killall node 
