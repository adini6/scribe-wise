const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); 
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'Develop/public')));

// Endpoint to retrieve notes
app.get('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'Develop/db/db.json'), 'utf8'));
    res.json(notes);
});

// Endpoint to save notes
app.post('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'Develop/db/db.json'), 'utf8'));
    const newNote = {
        ...req.body,
        id: uuidv4()
    };
    notes.push(newNote);
    fs.writeFileSync(path.join(__dirname, 'Develop/db/db.json'), JSON.stringify(notes));
    res.json(newNote);
});

// Endpoint to delete 
app.delete('/api/notes/:id', (req, res) => {
    const noteIdToDelete = req.params.id;
    const notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'Develop/db/db.json'), 'utf8'));
    const noteIndex = notes.findIndex(note => note.id === noteIdToDelete);

    if (noteIndex !== -1) {
        notes.splice(noteIndex, 1);
        fs.writeFileSync(path.join(__dirname, 'Develop/db/db.json'), JSON.stringify(notes));
        res.json({ message: 'Note deleted successfully' });
    } else {
        res.status(404).json({ error: 'Note not found' });
    }
});

// Route to notes.html 
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'Develop/public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'Develop/public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
});

app.use((err, req, res, next) => {
    console.error(err.stack); 
    res.status(500).json({ error: 'Something went wrong!' }); 
});
