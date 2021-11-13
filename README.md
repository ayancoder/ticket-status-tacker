# ticket-status-tacker
# install mongo
brew install mongodb-community@5.0
# start mongo process
 brew services start mongodb-community@5.0

# to make mongo run on start
To have launchd start mongodb/brew/mongodb-community now and restart at login:
  brew services start mongodb/brew/mongodb-community
Or, if you don't want/need a background service you can just run:
  mongod --config /usr/local/etc/mongod.conf

#kill already running node process.
sudo killall node 

# export mongo db.
mongodump -d <database_name> -o <directory_backup>
mongodump -d ticketDB -o .

# import mongo db.
mongorestore -d <database_name> <directory_backup>
aadak@aadak-a02 mongo-backup % ls
ticketDB
aadak@aadak-a02 mongo-backup % mongorestore -d ticketDB ticketDB
