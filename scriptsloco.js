/* ========== VERIFICACIÓN +18 ========== */
const enterBtn = document.getElementById("enterBtn");
const exitBtn = document.getElementById("exitBtn");
if(enterBtn){
    enterBtn.onclick = () => {
        localStorage.setItem("ageVerified", "true");
        window.location.href = "dashboard.html";
    }
}
if(exitBtn){
    exitBtn.onclick = () => {
        alert("Saliendo...");
        window.location.href = "https://google.com";
    }
}

// Bloquear acceso si no hay verificación
if(!localStorage.getItem("ageVerified") && !window.location.href.includes("index.html")){
    window.location.href = "index.html";
}

/* ========== PAÍSES HISPANOHABLANTES ========== */
const countries = ["España","México","Guatemala","Honduras","El Salvador","Nicaragua",
"Costa Rica","Panamá","Cuba","República Dominicana","Puerto Rico","Colombia","Venezuela",
"Ecuador","Perú","Bolivia","Paraguay","Chile","Argentina","Uruguay"];

/* ========== DASHBOARD ========== */
const countryList = document.getElementById("countryList");
if(countryList){
    countries.forEach(c => {
        const li = document.createElement("li");
        li.textContent = c;
        li.onclick = () => { window.location.href = `chat.html?country=${encodeURIComponent(c)}`; }
        countryList.appendChild(li);
    });

    document.getElementById("uploadBtn").onclick = () => window.location.href='upload.html';
    document.getElementById("videosBtn").onclick = () => window.location.href='videos.html';
    document.getElementById("profileBtn").onclick = () => window.location.href='profile.html';
    document.getElementById("logoutBtn").onclick = () => { localStorage.removeItem("ageVerified"); window.location.href="index.html"; }
}

/* ========== CHAT ========== */
const chatMessages = document.getElementById("chatMessages");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
if(chatMessages && messageInput && sendBtn){
    const urlParams = new URLSearchParams(window.location.search);
    const chatCountry = urlParams.get("country") || "Global";
    document.getElementById("chatTitle").textContent = `Chat ${chatCountry}`;
    let chats = JSON.parse(localStorage.getItem("chats") || "{}");
    if(!chats[chatCountry]) chats[chatCountry]=[];
    function renderMessages(){
        chatMessages.innerHTML="";
        chats[chatCountry].forEach(msg=>{
            const div = document.createElement("div");
            div.textContent=msg;
            chatMessages.appendChild(div);
        });
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    sendBtn.onclick = () => {
        const msg = messageInput.value.trim();
        if(!msg) return;
        chats[chatCountry].push(msg);
        localStorage.setItem("chats", JSON.stringify(chats));
        messageInput.value="";
        renderMessages();
    }
    renderMessages();
}

/* ========== UPLOAD ========== */
const uploadForm = document.getElementById("uploadForm");
if(uploadForm){
    uploadForm.onsubmit = e=>{
        e.preventDefault();
        const fileInput = document.getElementById("fileInput");
        const desc = document.getElementById("fileDesc").value;
        if(!fileInput.files[0]) return;
        let uploads = JSON.parse(localStorage.getItem("uploads") || "[]");
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function(){
            uploads.push({name:file.name,desc,url:reader.result,type:file.type});
            localStorage.setItem("uploads",JSON.stringify(uploads));
            alert("Archivo subido!");
            uploadForm.reset();
        }
        reader.readAsDataURL(file);
    }
}

/* ========== VIDEOS ========== */
const videoGrid = document.getElementById("videoGrid");
if(videoGrid){
    const uploads = JSON.parse(localStorage.getItem("uploads") || "[]");
    uploads.forEach(item=>{
        if(item.type.startsWith("video")){
            const video = document.createElement("video");
            video.src=item.url;
            video.controls=true;
            videoGrid.appendChild(video);
        }
    });
}

/* ========== PROFILE ========== */
const countrySelect = document.getElementById("countrySelect");
const saveProfile = document.getElementById("saveProfile");
if(countrySelect){
    countries.forEach(c=>{
        const opt = document.createElement("option");
        opt.value=c; opt.textContent=c;
        countrySelect.appendChild(opt);
    });
    const savedProfile = JSON.parse(localStorage.getItem("profile") || "{}");
    if(savedProfile.country) countrySelect.value = savedProfile.country;
    if(savedProfile.bio) document.getElementById("bio").value = savedProfile.bio;
    saveProfile.onclick = ()=>{
        const profile = {country: countrySelect.value, bio: document.getElementById("bio").value};
        localStorage.setItem("profile", JSON.stringify(profile));
        alert("Perfil guardado!");
    }
}
