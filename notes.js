const addBtn = document.querySelector("#addBtn");
const main = document.querySelector("#main");

// Click event listener
addBtn.addEventListener("click", function () {
    addNote();
});

// Auto-save functionality
let autoSaveTimeout;
const autoSave = () => {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
        saveNotes();
    }, 1500);
};

// Save button function
const saveNotes = () => {
    const notes = document.querySelectorAll(".note .content");
    const titles = document.querySelectorAll(".note .title");

    const data = [];

    notes.forEach((note, index) => {
        const content = note.value;
        const title = titles[index].value;
        
        if (content.trim() !== "" || title.trim() !== "") {
            data.push({ title, content });
        }
    });

    const titlesData = data.map((item) => item.title);
    localStorage.setItem("titles", JSON.stringify(titlesData));

    const contentData = data.map((item) => item.content);
    localStorage.setItem("notes", JSON.stringify(contentData));
};

// Add note function with enhanced UI
const addNote = (text = "", title = "") => {
    const note = document.createElement("div");
    note.classList.add("note");
    note.innerHTML = `
        <div class="icons">
            <i class="save fas fa-check-circle" title="Save note"></i>
            <i class="trash fas fa-trash-alt" title="Delete note"></i>
        </div>
        <div class="title-div">
            <textarea class="title" placeholder="Note title...">${title}</textarea>
        </div>
        <textarea class="content" placeholder="Write your thoughts here...">${text}</textarea>
    `;

    function handleTrashClick() {
        note.classList.add("deleting");
        setTimeout(() => {
            note.remove();
            saveNotes();
        }, 400);
    }

    function handleSaveClick() {
        saveNotes();
    }

    function handleTextInput() {
        autoSave();
    }

    const delBtn = note.querySelector(".trash");
    const saveButton = note.querySelector(".save");
    const textareas = note.querySelectorAll("textarea");

    delBtn.addEventListener("click", handleTrashClick);
    saveButton.addEventListener("click", handleSaveClick);
    
    textareas.forEach(textarea => {
        textarea.addEventListener("input", handleTextInput);
        textarea.addEventListener("keydown", (e) => {
            if (e.key === "Tab") {
                e.preventDefault();
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                textarea.value = textarea.value.substring(0, start) + "\t" + textarea.value.substring(end);
                textarea.selectionStart = textarea.selectionEnd = start + 1;
            }
        });
    });

    main.appendChild(note);
    saveNotes();
};

// Loading all saved notes from localStorage
function loadNotes() {
    const titlesData = JSON.parse(localStorage.getItem("titles")) || [];
    const contentData = JSON.parse(localStorage.getItem("notes")) || [];

    const maxLength = Math.max(titlesData.length, contentData.length);
    
    for (let i = 0; i < maxLength; i++) {
        addNote(contentData[i] || "", titlesData[i] || "");
    }
}

// Load notes when page loads
loadNotes();