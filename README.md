# Welcome to Github vmware-licences-management!

Voici une page web de gestion des licences VMware. Cela permet de faire le lien entre une liste d'equipement et une liste de licence.

# Files
vmware-licences-management
│   associations.json		--> fichier de lien entre equipement et licence
│   equipments.json		--> fichier equipement
│   licenses.json				--> fichier licence
│   server.js					--> backend

|	public							--> frontend



## UML diagrams

You can render UML diagrams using [Mermaid](https://mermaidjs.github.io/). For example, this will produce a sequence diagram:

```mermaid
sequenceDiagram
participant BackEnd
participant FrontEnd
FrontEnd->>BackEnd: get /api/equipments
BackEnd->>FrontEnd: liste equipement (json)

FrontEnd->>BackEnd: get /api/licenses
BackEnd->>FrontEnd: liste licenses(json)

FrontEnd->>BackEnd: get /api/associations
BackEnd->>FrontEnd: liste associations(json)

user->>FrontEnd: clique bouton association
FrontEnd->>BackEnd: post /api/associations
BackEnd->>FrontEnd: liste associations(json)
FrontEnd->>user: refresh page

```
## 1st Installation


mkdir vmware-licences
cd vmware-licences
npm init -y
npm install express cors body-parser
mkdir public
cd public
cd frontend
npm init vite@latest frontend -- --template vue
npm install

## Run

backend :
cd vmware-licences
node .\server.js
frontend :
cd vmware-licences/public/frontend
npm run dev
