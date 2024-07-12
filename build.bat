docker build -t vmware-licence .
docker image ls
docker container ls -a
docker run -d -it --name vmware-licence -p 3000:3000 -p 5173:5173 -v .\app\vmware-licences-management\backend\data\:/opt/vmware-licences-management/backend/data vmware-licence
docker container ls -a
docker exec -it vmware-licence /bin/sh