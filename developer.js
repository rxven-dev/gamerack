document.addEventListener("DOMContentLoaded", () => {
    // Core Identity Node Selectors
    const avatarContainer = document.querySelector(".editable-avatar-container");
    const avatarFileInput = document.getElementById("avatarFileInput");
    const avatarDisplay = document.getElementById("avatarDisplay");
    const topBarUser = document.getElementById("topBarUser");
    const inputName = document.getElementById("editProfName");
    const inputEmail = document.getElementById("editProfEmail");
    const saveBtn = document.getElementById("saveProfileBtn");

    // Cropping System Engine Selectors
    const cropperOverlay = document.getElementById("cropperOverlay");
    const cropPreviewImg = document.getElementById("cropPreviewImg");
    const cropZoomSlider = document.getElementById("cropZoomSlider");
    const applyCropBtn = document.getElementById("applyCropBtn");
    const closeCropperBtn = document.getElementById("closeCropperBtn");

    let originalImgBase64 = "";
    let isDragging = false;
    let startX, startY, imgLeft = 0, imgTop = 0;
    let currentScale = 1;

    // ⚡ EXPLICIT LOADING SCREEN TRIGGER FUNCTION ⚡
    const runGlobalLoadingAnimation = (callback) => {
        const loadingOverlay = document.getElementById("loading-screen") || document.querySelector(".loading-screen-overlay");
        
        if (loadingOverlay) {
            loadingOverlay.classList.remove("fade-out");
            loadingOverlay.style.display = "flex";
            
            setTimeout(() => {
                loadingOverlay.classList.add("fade-out");
                setTimeout(() => {
                    loadingOverlay.style.display = "none";
                    if (typeof callback === "function") callback();
                }, 600);
            }, 1200);
        } else {
            if (typeof callback === "function") callback();
        }
    };

    // 🔄 USER PREFERENCES MATRIX SYNC ENGINE 🔄
    const initProfileDataState = () => {
        // Fetch values mapped to the specific logged-in account ID
        const currentUserId = localStorage.getItem('logged_in_user_id') || 'GUEST_DEFAULT';
        
        const savedStudioName = localStorage.getItem(`profile_name_${currentUserId}`) || localStorage.getItem("logged_in_username") || "Apex Studios";
        const savedStudioEmail = localStorage.getItem(`profile_email_${currentUserId}`) || "admin@apexstudios.dev";
        const savedStudioAvatar = localStorage.getItem(`profile_avatar_${currentUserId}`);

        if (inputName) inputName.value = savedStudioName;
        if (inputEmail) inputEmail.value = savedStudioEmail;
        if (topBarUser) topBarUser.textContent = savedStudioName;

        if (avatarDisplay) {
            if (savedStudioAvatar) {
                avatarDisplay.style.backgroundImage = `url('${savedStudioAvatar}')`;
                avatarDisplay.textContent = "";
            } else {
                avatarDisplay.style.backgroundImage = "none";
                const initials = savedStudioName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
                avatarDisplay.textContent = initials || "AP";
            }
        }
    };

    if (avatarContainer) {
        avatarContainer.addEventListener("click", () => avatarFileInput.click());
    }

    if (avatarFileInput) {
        avatarFileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    originalImgBase64 = event.target.result;
                    cropPreviewImg.src = originalImgBase64;
                    
                    imgLeft = 0;
                    imgTop = 0;
                    currentScale = 1;
                    cropZoomSlider.value = 1;
                    
                    cropPreviewImg.style.transform = `translate(0px, 0px) scale(1)`;
                    cropperOverlay.style.display = "flex";
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (cropPreviewImg) {
        cropPreviewImg.addEventListener("mousedown", (e) => {
            isDragging = true;
            startX = e.clientX - imgLeft;
            startY = e.clientY - imgTop;
            cropPreviewImg.style.cursor = "grabbing";
            e.preventDefault();
        });

        window.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            imgLeft = e.clientX - startX;
            imgTop = e.clientY - startY;
            cropPreviewImg.style.transform = `translate(${imgLeft}px, ${imgTop}px) scale(${currentScale})`;
        });

        window.addEventListener("mouseup", () => {
            isDragging = false;
            if (cropPreviewImg) cropPreviewImg.style.cursor = "move";
        });
    }

    if (cropZoomSlider) {
        cropZoomSlider.addEventListener("input", (e) => {
            currentScale = parseFloat(e.target.value);
            cropPreviewImg.style.transform = `translate(${imgLeft}px, ${imgTop}px) scale(${currentScale})`;
        });
    }

    if (applyCropBtn) {
        applyCropBtn.addEventListener("click", () => {
            const canvas = document.createElement("canvas");
            canvas.width = 160;
            canvas.height = 160;
            const ctx = canvas.getContext("2d");

            const img = new Image();
            img.src = originalImgBase64;
            img.onload = () => {
                ctx.fillStyle = "#04020a";
                ctx.fillRect(0, 0, 160, 160);

                ctx.save();
                ctx.beginPath();
                ctx.arc(80, 80, 80, 0, Math.PI * 2);
                ctx.clip();

                const workspaceWidth = 450;
                const workspaceHeight = 280;
                
                const displayWidth = img.width * (280 / img.height);
                const displayHeight = 280;

                const centerOffsetX = (workspaceWidth - displayWidth) / 2;
                const centerOffsetY = 0;

                const finalRenderX = centerOffsetX + imgLeft;
                const finalRenderY = centerOffsetY + imgTop;

                ctx.translate(80, 80);
                ctx.scale(currentScale, currentScale);
                ctx.translate(-80, -80);

                ctx.drawImage(img, finalRenderX, finalRenderY, displayWidth, displayHeight);
                ctx.restore();

                const processedAvatarBase64 = canvas.toDataURL("image/png");
                cropperOverlay.style.display = "none";

                if (typeof triggerCentralSync === "function") {
                    triggerCentralSync("Processing Encrypted Asset Configurations", () => {
                        const currentUserId = localStorage.getItem('logged_in_user_id') || 'GUEST_DEFAULT';
                        avatarDisplay.style.backgroundImage = `url('${processedAvatarBase64}')`;
                        avatarDisplay.textContent = ""; 
                        localStorage.setItem(`profile_avatar_${currentUserId}`, processedAvatarBase64);
                    });
                } else {
                    const currentUserId = localStorage.getItem('logged_in_user_id') || 'GUEST_DEFAULT';
                    avatarDisplay.style.backgroundImage = `url('${processedAvatarBase64}')`;
                    avatarDisplay.textContent = ""; 
                    localStorage.setItem(`profile_avatar_${currentUserId}`, processedAvatarBase64);
                }
            };
        });
    }

    if (saveBtn) {
        saveBtn.addEventListener("click", () => {
            const customName = inputName.value.trim() || "Apex Studios";
            const customEmail = inputEmail.value.trim() || "admin@apexstudios.dev";

            if (typeof triggerCentralSync === "function") {
                triggerCentralSync("Syncing Profile Manifest Identity", () => {
                    const currentUserId = localStorage.getItem('logged_in_user_id') || 'GUEST_DEFAULT';
                    localStorage.setItem('logged_in_username', customName);
                    localStorage.setItem(`profile_name_${currentUserId}`, customName);
                    localStorage.setItem(`profile_email_${currentUserId}`, customEmail);
                    if (topBarUser) topBarUser.textContent = customName;
                });
            } else {
                const currentUserId = localStorage.getItem('logged_in_user_id') || 'GUEST_DEFAULT';
                localStorage.setItem('logged_in_username', customName);
                localStorage.setItem(`profile_name_${currentUserId}`, customName);
                localStorage.setItem(`profile_email_${currentUserId}`, customEmail);
                if (topBarUser) topBarUser.textContent = customName;
            }
        });
    }

    if (closeCropperBtn) {
        closeCropperBtn.addEventListener("click", () => cropperOverlay.style.display = "none");
    }
    
    initProfileDataState();
});