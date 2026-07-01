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
        // Look for your loading screen container element in the HTML
        const loadingOverlay = document.getElementById("loading-screen") || document.querySelector(".loading-screen-overlay");
        
        if (loadingOverlay) {
            // 1. Reveal your custom loading animation screen
            loadingOverlay.style.display = "flex";
            loadingOverlay.style.opacity = "1";

            // 2. Keep it active to show the premium loading visual, then fade out smoothly
            setTimeout(() => {
                loadingOverlay.style.opacity = "0";
                setTimeout(() => {
                    loadingOverlay.style.display = "none";
                    if (callback) callback(); // Run any save updates once the loader clears
                }, 400); // Wait for fade transition
            }, 1200); // Duration the loader stays visible
        } else {
            // Fallback if loading element is missing on certain sub-pages
            if (callback) callback();
        }
    };

    // 🔄 Load Saved Data Instantly on Refresh
    const initProfileDataState = () => {
        const storedName = localStorage.getItem("gr_studio_name");
        const storedEmail = localStorage.getItem("gr_studio_email");
        const storedAvatar = localStorage.getItem("gr_studio_avatar");

        if (storedName) {
            inputName.value = storedName;
            if (topBarUser) topBarUser.textContent = storedName;
        }
        if (storedEmail) inputEmail.value = storedEmail;
        if (storedAvatar) {
            avatarDisplay.style.backgroundImage = `url('${storedAvatar}')`;
            avatarDisplay.textContent = ""; 
        }
    };

    if (avatarContainer) {
        avatarContainer.addEventListener("click", () => avatarFileInput.click());
    }

    // Initialize Chosen Binary Asset Data Buffer Stream
    if (avatarFileInput) {
        avatarFileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                originalImgBase64 = event.target.result;
                cropPreviewImg.src = originalImgBase64;
                
                imgLeft = 20;
                imgTop = 20;
                currentScale = 1;
                cropZoomSlider.value = 1;
                
                updateImageTransform();
                cropperOverlay.style.display = "flex"; 
            };
            reader.readAsDataURL(file);
        });
    }

    const updateImageTransform = () => {
        cropPreviewImg.style.transform = `translate(${imgLeft}px, ${imgTop}px) scale(${currentScale})`;
    };

    cropZoomSlider.addEventListener("input", (e) => {
        currentScale = parseFloat(e.target.value);
        updateImageTransform();
    });

    cropPreviewImg.addEventListener("mousedown", (e) => {
        isDragging = true;
        startX = e.clientX - imgLeft;
        startY = e.clientY - imgTop;
        e.preventDefault();
    });

    window.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        imgLeft = e.clientX - startX;
        imgTop = e.clientY - startY;
        updateImageTransform();
    });

    window.addEventListener("mouseup", () => isDragging = false);

    // ✂️ Finalize Asset Crop with Loading Animation Connection
    applyCropBtn.addEventListener("click", () => {
        const canvas = document.createElement("canvas");
        canvas.width = 160;
        canvas.height = 160;
        const ctx = canvas.getContext("2d");

        const targetLensSize = 160;
        const frameW = 450; 
        const frameH = 280;
        
        const targetXInFrame = (frameW - targetLensSize) / 2;
        const targetYInFrame = (frameH - targetLensSize) / 2;

        const sourceX = (targetXInFrame - imgLeft) / currentScale;
        const sourceY = (targetYInFrame - imgTop) / currentScale;
        const sourceSize = targetLensSize / currentScale;

const imgInstance = new Image();
        imgInstance.src = originalImgBase64;
        imgInstance.onload = () => {
            ctx.drawImage(imgInstance, sourceX, sourceY, sourceSize, sourceSize, 0, 0, 160, 160);
            const processedAvatarBase64 = canvas.toDataURL("image/jpeg", 0.85);
            
            cropperOverlay.style.display = "none";

            // ⚡ UPDATED: Changed to your real central sync engine with text message parameter
            if (typeof triggerCentralSync === "function") {
                triggerCentralSync("Processing Encrypted Asset Configurations", () => {
                    avatarDisplay.style.backgroundImage = `url('${processedAvatarBase64}')`;
                    avatarDisplay.textContent = ""; 
                    localStorage.setItem("gr_studio_avatar", processedAvatarBase64);
                });
            } else {
                // Fallback direct execution loop if loader script fails to mount
                avatarDisplay.style.backgroundImage = `url('${processedAvatarBase64}')`;
                avatarDisplay.textContent = ""; 
                localStorage.setItem("gr_studio_avatar", processedAvatarBase64);
            }
        };
    });

// Replace your old save button logic inside assets/js/developer.js with this:
saveBtn.addEventListener("click", () => {
    const customName = inputName.value.trim() || "Apex Studios";
    const customEmail = inputEmail.value.trim() || "admin@apexstudios.dev";

    // Calls your real dynamic loading function from loading-screen.js
    if (typeof triggerCentralSync === "function") {
        triggerCentralSync("Syncing Profile Manifest Identity", () => {
            localStorage.setItem("gr_studio_name", customName);
            localStorage.setItem("gr_studio_email", customEmail);
            if (topBarUser) topBarUser.textContent = customName;
        });
    }
});

    closeCropperBtn.addEventListener("click", () => cropperOverlay.style.display = "none");
    initProfileDataState();
});