const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for handling JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'Develop/public')));

// API Endpoint to retrieve notes
app.get('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'Develop/db/notes.json'), 'utf8'));
    res.json(notes);
});

// API Endpoint to save notes
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    const notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'Develop/db/notes.json'), 'utf8'));
    newNote.id = notes.length > 0 ? notes[notes.length - 1].id + 1 : 1;  // Assigning an ID
    notes.push(newNote);
    fs.writeFileSync(path.join(__dirname, 'Develop/db/notes.json'), JSON.stringify(notes));
    res.json(newNote);
});

// route to notes.html 
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'Develop/public/notes.html'));
});


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'Develop/public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
});
