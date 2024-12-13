1. authentication issue in running mongodb in docker.
   -> In my case it was due to volume, I deleted the volume, re created it and then recreated the container
   Command to run the container
   1. Create a volume
docker volume create pizza-mongo-data
2. Run the container by attaching volume 
docker run --rm -d --name pizza-mongo-container -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD='secret' -p 27017:27017 -v pizza-mongo-data:/data/db mongo
3. Get inside the container
docker exec -it pizza-mongo-container bash
4. mongosh -u root -p secret
5. use admin
6. db.getUsers() -> it should return an array with one object
