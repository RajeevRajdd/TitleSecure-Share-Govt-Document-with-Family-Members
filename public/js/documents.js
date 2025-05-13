// Document management functions
function loadDashboard() {
    document.getElementById('main-content').innerHTML = `
        <div class="row">
            <div class="col-md-8">
                <h2>My Documents</h2>
                <div id="documents-list" class="row"></div>
            </div>
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Upload Document</h5>
                        <div class="upload-area" id="upload-area">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <p>Drag and drop files here or click to upload</p>
                            <input type="file" id="file-input" class="d-none" accept=".pdf,.jpg,.jpeg,.png">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add event listeners
    document.getElementById('upload-area').addEventListener('click', () => {
        document.getElementById('file-input').click();
    });

    document.getElementById('file-input').addEventListener('change', handleFileUpload);

    // Load documents
    loadDocuments();
}

// Load user's documents
async function loadDocuments() {
    try {
        const res = await fetch('/api/documents/my-documents', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        const documents = await res.json();
        
        const documentsList = document.getElementById('documents-list');
        documentsList.innerHTML = '';
        
        documents.forEach(doc => {
            documentsList.innerHTML += `
                <div class="col-md-6 mb-4">
                    <div class="card document-card">
                        <div class="card-body">
                            <div class="document-icon">
                                <i class="fas fa-file-${getFileIcon(doc.documentType)}"></i>
                            </div>
                            <h5 class="document-title">${doc.title}</h5>
                            <p class="document-meta">
                                Type: ${doc.documentType}<br>
                                Uploaded: ${new Date(doc.createdAt).toLocaleDateString()}
                            </p>
                            <div class="btn-group">
                                <button class="btn btn-sm btn-primary" onclick="viewDocument('${doc._id}')">
                                    View
                                </button>
                                <button class="btn btn-sm btn-success" onclick="shareDocument('${doc._id}')">
                                    Share
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="deleteDocument('${doc._id}')">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        showAlert('danger', 'Error loading documents');
    }
}

// Handle file upload
async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('document', file);
    formData.append('title', file.name);
    formData.append('documentType', getDocumentType(file.name));

    try {
        const res = await fetch('/api/documents/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });

        if (res.ok) {
            showAlert('success', 'Document uploaded successfully');
            loadDocuments();
        } else {
            const data = await res.json();
            showAlert('danger', data.message);
        }
    } catch (error) {
        showAlert('danger', 'Error uploading document');
    }
}

// Share document
async function shareDocument(documentId) {
    const email = prompt('Enter email address to share with:');
    if (!email) return;

    try {
        const res = await fetch(`/api/documents/share/${documentId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        if (res.ok) {
            showAlert('success', 'Document shared successfully');
        } else {
            const data = await res.json();
            showAlert('danger', data.message);
        }
    } catch (error) {
        showAlert('danger', 'Error sharing document');
    }
}

// Delete document
async function deleteDocument(documentId) {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
        const res = await fetch(`/api/documents/${documentId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (res.ok) {
            showAlert('success', 'Document deleted successfully');
            loadDocuments();
        } else {
            const data = await res.json();
            showAlert('danger', data.message);
        }
    } catch (error) {
        showAlert('danger', 'Error deleting document');
    }
}

// View document
async function viewDocument(documentId) {
    try {
        const res = await fetch(`/api/documents/${documentId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (res.ok) {
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            window.open(url);
        } else {
            const data = await res.json();
            showAlert('danger', data.message);
        }
    } catch (error) {
        showAlert('danger', 'Error viewing document');
    }
}

// Helper function to get file icon
function getFileIcon(documentType) {
    switch (documentType.toLowerCase()) {
        case 'pdf':
            return 'pdf';
        case 'image':
            return 'image';
        default:
            return 'alt';
    }
}

// Helper function to get document type from filename
function getDocumentType(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    if (ext === 'pdf') return 'PDF';
    if (['jpg', 'jpeg', 'png'].includes(ext)) return 'Image';
    return 'Other';
} 