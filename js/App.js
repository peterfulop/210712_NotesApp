import NotesAPI from "./NotesAPI.js";
import NotesView from "./NotesView.js";

export default class App {

    constructor(root) {
        this.notes = [];
        this.activeNote = null;
        this.view = new NotesView(root, this._handlers());
        this._refreshNotes();
    };

    _refreshNotes() {
        const notes = NotesAPI.getAllNotes();
        this._setNotes(notes);
        if (notes.length > 0) {
            this._setActiveNote(notes[0]);
        }
    };

    _setNotes(notes) {
        this.notes = notes;
        this.view.updateNoteList(notes);
        this.view.updateNotePreviewVisibility(notes.length > 0);
    };

    _setActiveNote(note) {
        this.activeNote = note;
        this.view.updateActiveNote(note);
    }

    _handlers() {

        return {
            oneNoteSelect: (noteId) => {
                console.log(`Note selected: ${noteId}`);
                const selectedNote = this.notes.find(note => note.id == noteId);
                this._setActiveNote(selectedNote);
            },

            oneNoteAdd: () => {
                console.log("Note add");
                const newNote = {
                    title: "New Note",
                    body: "Take note..."
                };
                NotesAPI.saveNote(newNote);
                this._refreshNotes();
            },

            oneNoteEdit: (title, body) => {
                console.log(title, body);
                NotesAPI.saveNote({
                    id: this.activeNote.id,
                    title,
                    body,
                })
                this._refreshNotes();
            },

            oneNoteDelete: (noteId) => {
                console.log(`Note DELETED: ${noteId}`);
                NotesAPI.deleteNote(noteId);
                this._refreshNotes();
            },
        };
    };
}