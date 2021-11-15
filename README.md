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

# kill already running node process.
sudo killall node 

# export mongo db.
mongodump -d <database_name> -o <directory_backup>
mongodump -d ticketDB -o .

# import mongo db.
mongorestore -d <database_name> <directory_backup>
aadak@aadak-a02 mongo-backup % ls
ticketDB
aadak@aadak-a02 mongo-backup % mongorestore -d ticketDB ticketDB

# mongo config file for mac.
 /usr/local/etc/mongod.conf --  configuration file
 /usr/local/var/log/mongodb --  log directory
 /usr/local/var/mongodb     --  data directory
 # mongo config file for ubuntu
/etc/mongod.conf --  configuration file
/var/log/mongodb -- log directory
/var/lib/mongodb --  data directory

# node v17 throws exception connecting with mongo.
Node v17 prefers IPv6 addresses over IPv4.But mongo by default is configured with ipv4.
IPv4 config
net:
  port: 27017
  bindIp: 127.0.0.1
Need to change it to :
net:
      ipv6: true
      port: 27017
      bindIpAll: true
OSX path : /usr/local/etc/mongod.conf
Ubuntu Path: /etc/mongod.conf

https://stackoverflow.com/questions/69957163/mongooseserverselectionerror-connect-econnrefused-127017-in-node-v17-and-mon

# start application in ubuntu server
 pm2 stop ticket-tracker
 pm2 start ticket-tracker
 pm2 status