const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const readJSONFile = (filename) => {
    return JSON.parse(fs.readFileSync(filename, 'utf-8'));
};

const writeJSONFile = (filename, data) => {
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
};

app.get('/api/equipments', (req, res) => {
    const equipments = readJSONFile('equipments.json');
    res.json(equipments);
});

app.get('/api/licenses', (req, res) => {
    const licenses = readJSONFile('licenses.json');
    res.json(licenses);
});

app.get('/api/associations', (req, res) => {
    const associations = readJSONFile('associations.json');
    res.json(associations);
});

app.post('/api/associations', (req, res) => {
    const { equipmentId, licenseId } = req.body;
    const equipments = readJSONFile('equipments.json');
    const licenses = readJSONFile('licenses.json');
    const associations = readJSONFile('associations.json');

    const equipment = equipments.find(e => e.id === equipmentId);
    const license = licenses.find(l => l.id === licenseId);

    if (!equipment || !license) {
        return res.status(400).json({ error: 'Invalid equipment or license ID' });
    }

    // if (equipment.type !== license.type) {
    //     return res.status(400).json({ error: 'Equipment type and license type do not match' });
    // }

    const newAssociation = { equipmentId, licenseId };
    associations.push(newAssociation);
    writeJSONFile('associations.json', associations);
    res.status(201).json(newAssociation);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
