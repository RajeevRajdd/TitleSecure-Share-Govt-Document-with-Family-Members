// Main application logic
document.addEventListener('DOMContentLoaded', () => {
    // Navigation event listeners
    document.getElementById('dashboard-link').addEventListener('click', (e) => {
        e.preventDefault();
        loadDashboard();
    });

    document.getElementById('upload-link').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('file-input').click();
    });

    document.getElementById('shared-link').addEventListener('click', (e) => {
        e.preventDefault();
        loadSharedDocuments();
    });

    // Load shared documents
    async function loadSharedDocuments() {
        try {
            const res = await fetch('/api/documents/shared-with-me', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            const documents = await res.json();
            
            document.getElementById('main-content').innerHTML = `
                <h2>Shared with Me</h2>
                <div class="row" id="shared-documents-list"></div>
            `;
            
            const documentsList = document.getElementById('shared-documents-list');
            
            if (documents.length === 0) {
                documentsList.innerHTML = `
                    <div class="col-12">
                        <div class="alert alert-info">
                            No documents have been shared with you yet.
                        </div>
                    </div>
                `;
                return;
            }
            
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
                                    Shared by: ${doc.owner.name}<br>
                                    Type: ${doc.documentType}<br>
                                    Shared on: ${new Date(doc.sharedAt).toLocaleDateString()}
                                </p>
                                <button class="btn btn-sm btn-primary" onclick="viewDocument('${doc._id}')">
                                    View
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
        } catch (error) {
            showAlert('danger', 'Error loading shared documents');
        }
    }

    // Add drag and drop functionality
    const uploadArea = document.getElementById('upload-area');
    if (uploadArea) {
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('border-primary');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('border-primary');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('border-primary');
            
            const file = e.dataTransfer.files[0];
            if (file) {
                const input = document.getElementById('file-input');
                input.files = e.dataTransfer.files;
                handleFileUpload({ target: input });
            }
        });
    }
}); 