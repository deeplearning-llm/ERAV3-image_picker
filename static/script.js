document.addEventListener('DOMContentLoaded', function() {
    // Animal selection functionality
    const animalSelection = document.querySelector('.animal-selection');
    const animalImageContainer = document.querySelector('#animal-image');
    const animalImage = document.querySelector('#animal-image img');
    
    const animalImages = {
        cat: '/static/images/cat.jpg',
        dog: '/static/images/dog.jpg',
        elephant: '/static/images/elephant.jpg'
    };

    animalSelection.addEventListener('change', function(e) {
        if (e.target.type === 'radio') {
            const selectedAnimal = e.target.value;
            
            // Show loading state
            animalImageContainer.classList.add('loading');
            animalImage.style.display = 'none';
            
            // Load local image
            animalImage.src = animalImages[selectedAnimal];
            animalImage.alt = `A ${selectedAnimal}`;
            
            // Handle image load success
            animalImage.onload = function() {
                animalImage.style.display = 'block';
                animalImageContainer.classList.remove('loading');
                zoomSlider.value = 100;
                zoomValue.textContent = '100%';
                animalImage.style.transform = 'scale(1)';
            };
            
            // Handle image load error
            animalImage.onerror = function() {
                animalImageContainer.innerHTML = 'Failed to load image';
                animalImageContainer.classList.remove('loading');
            };
        }
    });

    // File upload functionality
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const fileInfo = document.getElementById('file-info');
    const progressBar = document.querySelector('.progress-bar');
    const progressBarFill = document.querySelector('.progress-bar-fill');

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight drop zone when dragging over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    // Handle dropped files
    dropZone.addEventListener('drop', handleDrop, false);
    fileInput.addEventListener('change', handleFiles, false);

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight(e) {
        dropZone.classList.add('bg-blue-50');
    }

    function unhighlight(e) {
        dropZone.classList.remove('bg-blue-50');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles({ target: { files: files } });
    }

    function handleFiles(e) {
        const file = e.target.files[0];
        uploadFile(file);
    }

    function uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);

        progressBar.style.display = 'block';
        fileInfo.innerHTML = 'Uploading...';

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            progressBarFill.style.width = '100%';
            fileInfo.innerHTML = `
                <div class="success-message">
                    File uploaded successfully!
                    <div>Name: ${data.name}</div>
                    <div>Size: ${formatBytes(data.size)}</div>
                    <div>Type: ${data.type}</div>
                </div>
            `;
        })
        .catch(error => {
            progressBarFill.style.width = '0%';
            fileInfo.innerHTML = `
                <div class="error-message">
                    Error: ${error.message}
                </div>
            `;
        })
        .finally(() => {
            setTimeout(() => {
                progressBar.style.display = 'none';
                progressBarFill.style.width = '0%';
            }, 2000);
        });
    }

    function formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Add this after your existing animal selection code
    const zoomSlider = document.querySelector('.zoom-slider');
    const zoomValue = document.querySelector('.zoom-value');

    zoomSlider.addEventListener('input', function(e) {
        const zoom = e.target.value;
        const img = document.querySelector('#animal-image img');
        
        if (img.style.display !== 'none') {
            img.style.transform = `scale(${zoom / 100})`;
            zoomValue.textContent = `${zoom}%`;
        }
    });
}); 