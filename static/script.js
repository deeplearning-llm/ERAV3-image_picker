document.addEventListener('DOMContentLoaded', function() {
    // Handle animal selection
    const animalInputs = document.querySelectorAll('input[name="animal"]');
    const animalImage = document.getElementById('animal-image');

    animalInputs.forEach(input => {
        input.addEventListener('change', function() {
            const selectedAnimal = this.value;
            const img = new Image();
            
            // Show loading state
            animalImage.innerHTML = '<p>Loading...</p>';
            
            img.onload = function() {
                animalImage.innerHTML = '';
                animalImage.appendChild(img);
            };
            
            img.onerror = function() {
                animalImage.innerHTML = '<p style="color: red;">Error loading image</p>';
            };
            
            img.src = `/static/images/${selectedAnimal}.jpg`;
            img.alt = selectedAnimal;
        });
    });

    // Handle file upload
    const fileInput = document.getElementById('file-input');
    const fileInfo = document.getElementById('file-info');

    fileInput.addEventListener('change', async function() {
        const file = this.files[0];
        if (!file) return;

        // Show loading state
        fileInfo.innerHTML = '<p>Processing file...</p>';

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            fileInfo.innerHTML = `
                <p><strong>File Name:</strong> ${data.name}</p>
                <p><strong>File Size:</strong> ${formatFileSize(data.size)}</p>
                <p><strong>File Type:</strong> ${data.type}</p>
            `;
        } catch (error) {
            fileInfo.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
        }
    });

    // Helper function to format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}); 