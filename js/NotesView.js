export default class NotesView {

    constructor(root, { oneNoteSelect, oneNoteAdd, oneNoteEdit, oneNoteDelete } = {}) {

        this.root = root;
        this.oneNoteSelect = oneNoteSelect;
        this.oneNoteAdd = oneNoteAdd;
        this.oneNoteEdit = oneNoteEdit;
        this.oneNoteDelete = oneNoteDelete;
        this.root.innerHTML = this._renderRootHTML();
        this.DOM = this._setDOM();

        this.DOM.btnAddNote.addEventListener("click", () => {
            this.oneNoteAdd();
        });

        [this.DOM.inpTitle, this.DOM.inpBody].forEach(inputField => {

            inputField.addEventListener("blur", () => {
                const updateTitle = this.DOM.inpTitle.value.trim();
                const updateBody = this.DOM.inpBody.value.trim();
                this.oneNoteEdit(updateTitle, updateBody);
            })
        });
    };


    _setDOM() {
        return {
            btnAddNote: this.root.querySelector(".notes__add"),
            inpTitle: this.root.querySelector(".notes__title"),
            inpBody: this.root.querySelector(".notes__body"),
            notesList: this.root.querySelector(".notes__list"),
            notesPreview: this.root.querySelector(".notes__preview"),
        };
    }

    _renderRootHTML() {
        return `
        <div class="notes__sidebar">
            <button class="notes__add" type="button">Add Note</button>
            <div class="notes__list"></div>
        </div>
        <div class="notes__preview">
            <input class="notes__title" type="text" placeholder="New Note...">
            <textarea class="notes__body">Take Note...</textarea>
        </div>`
    };



    _createListItemHTML(id, title, body, updated) {

        const MAX_BODY_LENGTH = 60;
        updated = updated.toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" });

        return `<div class="notes__list-item" data-note-id=${id}>
            <div class="notes__small-title">${title}</div>
            <div class="notes__small-body">
                ${body.substring(0, MAX_BODY_LENGTH)}
                ${body.length > MAX_BODY_LENGTH ? "..." : ""}
            </div>
            <div class="notes__small-updated">
                ${updated}
            </div>
        </div>`

    };

    updateNoteList(notes) {
        const notesListContainer = this.DOM.notesList;
        notesListContainer.innerHTML = "";

        notes.map(note => {
            notesListContainer.innerHTML += this._createListItemHTML(
                note.id,
                note.title,
                note.body,
                new Date(note.updated)
            )
        });

        const notesListItems = this.root.querySelectorAll(".notes__list-item");
        notesListItems.forEach(listItem => {
            listItem.addEventListener("click", () => {
                this.oneNoteSelect(listItem.dataset.noteId);
            })
        });

        notesListItems.forEach(listItem => {
            listItem.addEventListener("dblclick", () => {
                const doDelete = confirm("Are you sure, you want to delete this note?");
                if (doDelete) {
                    this.oneNoteDelete(listItem.dataset.noteId);
                }
            })
        });

    };

    updateActiveNote(note) {
        this.root.querySelector(".notes__title").value = note.title;
        this.root.querySelector(".notes__body").value = note.body;
        const notesListItems = this.root.querySelectorAll(".notes__list-item");
        notesListItems.forEach(listItem => {
            listItem.classList.remove("notes__list-item--selected");
        });
        this.root.querySelector(`.notes__list-item[data-note-id="${note.id}"]`).classList.add("notes__list-item--selected");
    };

    updateNotePreviewVisibility(visible) {
        this.DOM.notesPreview.style.visibility = visible ? "visible" : "hidden";
    };

}