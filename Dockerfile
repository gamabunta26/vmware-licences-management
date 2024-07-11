# --------------- DÉBUT COUCHE OS -------------------
    FROM alpine:latest
    # --------------- FIN COUCHE OS ---------------------
    
    
    # MÉTADONNÉES DE L'IMAGE
    LABEL version="1.0" maintainer="gamabunta26"
        
    # --------------- DÉBUT COUCHE NODEJS/NPM ---------------
    RUN apk add nodejs
    RUN apk add npm
    # --------------- FIN COUCHE NODEJS/NPM -----------------
    

    # --------------- DÉBUT COPY CODE ------------------
    COPY app /opt/
    # --------------- FIN COPY CODE --------------------
    
    # --------------- DÉBUT npm install ------------------
    WORKDIR /opt/vmware-licences-management/backend/
    RUN npm install
    WORKDIR /opt/vmware-licences-management/frontend/
    RUN npm install
    # --------------- FIN npm install ------------------
    
    # OUVERTURE DU PORT HTTP
    EXPOSE 3000
    EXPOSE 5173
    
    ##VOLUME##
    VOLUME ["/opt/vmware-licences-management/backend/data"]

    WORKDIR /opt/vmware-licences-management
    # DÉMARRAGE DES SERVICES LORS DE L'EXÉCUTION DE L'IMAGE
    ENTRYPOINT  /opt/vmware-licences-management/start_app.sh
    
    