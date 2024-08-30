const audioClips = document.querySelectorAll(".audio-clip");
const videoClips = document.querySelectorAll(".video-clip");
let draggingAudioClip = null;
let draggingVideoClip = null;
let startColumn = 0;
const timeOffset = 10;
const amountOfTimeStamps = 600;
const timeStampSize = 51;
const width = timeStampSize * amountOfTimeStamps;

async function start() {
    const audioTimeLine = document.getElementById("audio-timeline");
    const videoTimeLine = document.getElementById("video-timeline");
    for (let i = 0; i < amountOfTimeStamps; i++) {
        audioTimeLine.innerHTML += "<div class=\"audio-clip-slot\" draggable=\"false\" style=\"grid-column: span 1;\"></div>";
        videoTimeLine.innerHTML += "<div class=\"video-clip-slot\" draggable=\"false\" style=\"grid-column: span 1;\"></div>";
    }
}

async function printTimeStamps() {
    const timeLine = document.getElementById("timestamps");
    for (let i = 0; i < amountOfTimeStamps; i += 1) {
        if ((i * timeOffset) % 60 < 10) {
            timeLine.innerHTML += `<div class="timestamp" style="grid-column: span 1;">${Math.floor((i * timeOffset) / 60) + ":0" + ((i * timeOffset) % 60)}</div>`;
            continue;
        }
        timeLine.innerHTML += `<div class="timestamp" style="grid-column: span 1;">${Math.floor((i * timeOffset) / 60) + ":" + ((i * timeOffset) % 60)}</div>`;
    }
}

function printFiles() {
    fetch("/files")
        .then((response) => response.json())
        .then((files) => {
            const displayFiles = document.getElementById("displayFiles");
            files.forEach((file) => {
                const fileElement = document.createElement("div");
                fileElement.classList.add("file");
                fileElement.classList.add("video-clip");
                fileElement.style.gridColumn =
          "span " + Math.round((file.duration * 3) / timeOffset);
                fileElement.innerText = file.name;
                fileElement.draggable = true;
                fileElement.dataset.duration = file.duration; // assuming the backend provides the duration
                fileElement.addEventListener("dragstart", (e) => {
                    draggingVideoClip = fileElement;
                    startColumn = [ ...draggingVideoClip.parentElement.children ].indexOf(
                        draggingVideoClip
                    );
                    setTimeout(() => fileElement.classList.add("dragging"), 0);
                });

                fileElement.addEventListener("dragend", () => {
                    draggingVideoClip.classList.remove("dragging");
                    draggingVideoClip = null;
                });
                displayFiles.appendChild(fileElement);
            });
        });
}

initial();

function setupAudioClipEventListener() {
    const audioClips = document.querySelectorAll(".audio-clip");
    audioClips.forEach((clip) => {
        clip.addEventListener("dragstart", (e) => {
            draggingAudioClip = clip;
            startColumn = [ ...draggingAudioClip.parentElement.children ].indexOf(
                draggingAudioClip
            );
            setTimeout(() => clip.classList.add("dragging"), 0);
        });

        clip.addEventListener("dragend", () => {
            draggingAudioClip.classList.remove("dragging");
            draggingAudioClip = null;
        });
    });

    const audioTimeLineContainer = document.getElementById("audio-timeline");

    audioTimeLineContainer.addEventListener("dragover", (e) => {
        e.preventDefault();
        if (draggingVideoClip) return;
        const afterElement = audioGetDragAfterElement(
            audioTimeLineContainer,
            e.clientX
        );
        const dragging = document.querySelector(".dragging");
        if (afterElement == null) {
            audioTimeLineContainer.appendChild(dragging);
        } else if (afterElement instanceof Node) {
            audioTimeLineContainer.insertBefore(dragging, afterElement);
        }
    });
}

function setupVideoClipEventListener() {
    const videoClips = document.querySelectorAll(".video-clip");
    videoClips.forEach((clip) => {
        clip.addEventListener("dragstart", (e) => {
            draggingVideoClip = clip;
            startColumn = [ ...draggingVideoClip.parentElement.children ].indexOf(
                draggingVideoClip
            );
            setTimeout(() => clip.classList.add("dragging"), 0);
        });

        clip.addEventListener("dragend", () => {
            draggingVideoClip.classList.remove("dragging");
            draggingVideoClip = null;
        });
    });

    const videoTimeLineContainer = document.getElementById("video-timeline");

    videoTimeLineContainer.addEventListener("dragover", (e) => {
        e.preventDefault();
        if (draggingAudioClip) return;
        const afterElement = videoGetDragAfterElement(
            videoTimeLineContainer,
            e.clientX
        );
        const dragging = document.querySelector(".dragging");
        if (afterElement == null) {
            videoTimeLineContainer.appendChild(dragging);
        } else if (afterElement instanceof Node) {
            videoTimeLineContainer.insertBefore(dragging, afterElement);
        }
    });
}

function setupFileEventListener() {
    const fileContainer = document.getElementById("displayFiles");
    fileContainer.addEventListener("dragover", (e) => {
        e.preventDefault();
    });
    const dragging = document.querySelector(".dragging");
    if (draggingVideoClip != null) {
        fileContainer.appendChild(dragging);
    } else {
        fileContainer.appendChild(dragging);
    }
}

async function initial() {
    await start();
    await printTimeStamps();
    printFiles();

    setupAudioClipEventListener();
    setupVideoClipEventListener();
    setupFileEventListener();
}

function videoGetDragAfterElement(container, x) {
    const clips = [ ...container.querySelectorAll(".video-clip:not(.dragging)") ];
    const slots = [ ...container.querySelectorAll(".video-clip-slot") ];
    const allElements = clips.concat(slots);

    return (
        allElements.reduce(
            (closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = x - box.left - box.width / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            },
            { offset: Number.NEGATIVE_INFINITY }
        ).element || null
    );
}

function audioGetDragAfterElement(container, x) {
    const clips = [ ...container.querySelectorAll(".audio-clip:not(.dragging)") ];
    const slots = [ ...container.querySelectorAll(".audio-clip-slot") ];
    const allElements = clips.concat(slots);

    return (
        allElements.reduce(
            (closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = x - box.left - box.width / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            },
            { offset: Number.NEGATIVE_INFINITY }
        ).element || null
    );
}
