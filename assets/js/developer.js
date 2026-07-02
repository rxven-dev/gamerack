document.addEventListener("DOMContentLoaded", async () => {
    // Rely on the global initialization set by index.html
    const spClient = window.globalSupabase;

    // Core Identity Node Selectors
    const avatarContainer = document.querySelector(".editable-avatar-container");
    const avatarFileInput = document.getElementById("avatarFileInput");
    const avatarDisplay = document.getElementById("avatarDisplay");
    const topBarUser = document.getElementById("topBarUser");
    const saveBtn = document.getElementById("saveProfileBtn");

    // Cropping System Engine Selectors
    const cropperOverlay = document.getElementById("cropperOverlay");
    const cropPreviewImg = document.getElementById("cropPreviewImg");
    const cropZoomSlider = document.getElementById("cropZoomSlider");
    const applyCropBtn = document.getElementById("applyCropBtn");
    const closeCropperBtn = document.getElementById("closeCropperBtn");

    // 🔮 CRITICAL FIX: Define the cropper instance in the file scope
    let cropper = null; 

// --- 🔄 Synchronize Database Row State on Load ---
    const initProfileDataState = async () => {
        if (!spClient) return;
        
        try {
            const { data: { user } } = await spClient.auth.getUser();
            if (!user) return;

            // Fetch the logged-in user profile manifest
            let { data: profile, error: fetchErr } = await spClient
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .maybeSingle();

            // 🎯 FIXED: If the profile row doesn't exist yet, seed it with auth defaults!
            if (!profile && !fetchErr) {
                const defaultName = user.user_metadata?.full_name || "New Developer";
                const defaultEmail = user.email || "";

                const { data: newProfile, error: insertErr } = await spClient
                    .from('profiles')
                    .upsert({
                        id: user.id,
                        profile_name: defaultName,
                        profile_email: defaultEmail,
                        avatar_url: ""
                    })
                    .select()
                    .single();

                if (!insertErr) profile = newProfile;
            }

            console.log("DEVELOPER.JS FETCH ON LOAD CALIBRATION:", { profile, fetchErr });

            if (profile) {
                const nameElements = document.querySelectorAll("#editProfName");
                const emailElements = document.querySelectorAll("#editProfEmail");
                
                nameElements.forEach(el => el.value = profile.profile_name || "");
                emailElements.forEach(el => el.value = profile.profile_email || "");
                
                if (topBarUser) topBarUser.textContent = profile.profile_name || "Apex Studios";
                
                if (avatarDisplay && profile.avatar_url) {
                    avatarDisplay.style.backgroundImage = `url(${profile.avatar_url})`;
                    avatarDisplay.textContent = "";
                }
            }
        } catch (err) {
            console.error("Error initializing profile data state:", err);
        }
    };

    if (avatarContainer && avatarFileInput) {
        avatarContainer.addEventListener("click", () => avatarFileInput.click());
    }

    // --- 📸 Handle File Loading & Initialize Circle Cropper ---
    if (avatarFileInput) {
        avatarFileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    // Reset old cropper framework completely before swapping sources
                    if (cropper) {
                        cropper.destroy();
                        cropper = null;
                    }
                    
                    cropPreviewImg.src = event.target.result;
                    cropperOverlay.style.display = "flex";

                    // Build standard cropper configuration matching your example image
                    cropper = new Cropper(cropPreviewImg, {
                        aspectRatio: 1,         // Locks crop box to 1:1 perfect ratio
                        viewMode: 1,            // Keeps your image asset strictly bound within layout canvas limits
                        dragMode: 'move',       // Enables sleek panning/dragging background controls
                        autoCropArea: 0.75,     // Sizes selection container neatly relative to framework boundaries
                        restore: false,
                        guides: false,          // Removes background alignment grid lines
                        center: false,          // Disables messy center crosshairs
                        highlight: false,       // Disables internal bright color filters
                        cropBoxMovable: false,  // Locks the mask center track position in place
                        cropBoxResizable: false,// Removes corner points resizing handles
                        toggleDragModeOnDblclick: false,
                        ready() {
                            if (cropZoomSlider) {
                                cropZoomSlider.value = 0; // Baseline slider offset tracking calibration
                            }
                        }
                    });
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // --- 🎚️ Simple Slider Zoom Listener ---
    if (cropZoomSlider) {
        cropZoomSlider.addEventListener("input", (e) => {
            if (cropper) {
                const value = parseFloat(e.target.value);
                // Map range 0-100 smoothly to zoom scales 1.0x through 3.0x
                const zoomFactor = 1 + (value / 50); 
                cropper.zoomTo(zoomFactor);
            }
        });
    }

    // --- ✂️ Native Cropper Export Logic Fix ---
    if (applyCropBtn) {
        applyCropBtn.addEventListener("click", async () => {
            if (!cropper) return;

            // 🎯 Get the clean cropped image canvas directly from Cropper.js API
            const canvas = cropper.getCroppedCanvas({
                width: 150,
                height: 150
            });

            if (!canvas) return;

            const croppedBase64 = canvas.toDataURL("image/png");

            // Update user dashboard preview display container
            if (avatarDisplay) {
                avatarDisplay.style.backgroundImage = `url(${croppedBase64})`;
                avatarDisplay.textContent = "";
            }

            // Hide overlay modal and clean up RAM allocations
            cropperOverlay.style.display = "none";
            cropper.destroy();
            cropper = null;

            // Send base64 asset packet directly to your Cloud Database Node
            if (spClient) {
                try {
                    const { data: { user } } = await spClient.auth.getUser();
                    if (user) {
                        const { error } = await spClient.from('profiles').upsert({
                            id: user.id,
                            avatar_url: croppedBase64
                        });
                        if (error) console.error("Avatar sync error:", error.message);
                    }
                } catch (err) {
                    console.error("Failed uploading profile asset packet:", err);
                }
            }
        });
    }

    // --- 💾 Profile Identity Manifest Details Save Button ---
    if (saveBtn) {
        saveBtn.addEventListener("click", () => {
            const commitToCloud = async () => {
                if (!spClient) return;

                try {
                    const { data: { user } } = await spClient.auth.getUser();
                    if (!user) return;

                    const nameElements = document.querySelectorAll("#editProfName");
                    const emailElements = document.querySelectorAll("#editProfEmail");

                    let customName = "";
                    let customEmail = "";

                    for (let el of nameElements) {
                        if (el.value.trim() !== "") {
                            customName = el.value.trim();
                            break;
                        }
                    }

                    for (let el of emailElements) {
                        if (el.value.trim() !== "") {
                            customEmail = el.value.trim();
                            break;
                        }
                    }

                    if (!customName) customName = "Apex Studios";
                    if (!customEmail) customEmail = "admin@apexstudios.dev";

                    const { data, error } = await spClient.from('profiles').upsert({
                        id: user.id,
                        profile_name: customName,
                        profile_email: customEmail
                    }).select();
                    
                    if (error) {
                        console.error("Database Write Error:", error.message);
                        if (error.message.includes("unique_profile_name") || error.code === "23505") {
                            triggerCentralAlert(`<span>⚠️</span> The username "<strong>${customName}</strong>" is already taken! Please choose a different identity manifest.`);
                            const originalName = topBarUser ? topBarUser.textContent : "Apex Studios";
                            nameElements.forEach(el => el.value = originalName);
                        } else {
                            triggerCentralAlert("<span>❌</span> An unexpected error occurred while syncing your manifest identity.");
                        }
                    } else {
                        triggerCentralAlert("<span>✨</span> Identity Manifest successfully synchronized to the cloud node!");
                        nameElements.forEach(el => el.value = customName);
                        emailElements.forEach(el => el.value = customEmail);
                        if (topBarUser && customName) topBarUser.textContent = customName;
                    }
                } catch (err) {
                    console.error("Error saving profile:", err);
                }
            };

            if (typeof triggerCentralSync === "function") {
                triggerCentralSync("Syncing Profile Manifest Identity", () => {
                    commitToCloud();
                });
            } else {
                commitToCloud();
            }
        });
    }

    if (closeCropperBtn) {
        closeCropperBtn.addEventListener("click", () => {
            cropperOverlay.style.display = "none";
            if (cropper) {
                cropper.destroy();
                cropper = null;
            }
        });
    }
    
    if (spClient) {
        await initProfileDataState();
    }
});