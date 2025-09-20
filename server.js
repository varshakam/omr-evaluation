const express = require('express');
const multer = require('multer');
const path = require('path');
const omrProcessor = require('./omrProcessor');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('omrSheet'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    try {
        // Pass file path to omrProcessor
        const result = await omrProcessor.processOMR(req.file.path);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error processing OMR sheet');
    }
});

app.get('/', (req, res) => {
    res.send("OMR Scoring Backend is running.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
