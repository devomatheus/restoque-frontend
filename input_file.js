import { showAlert } from './alertas.js';

document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('excelFiles');
    const fileList = document.getElementById('fileList');
    const importBtn = document.getElementById('importBtn');
    let selectedFiles = [];

    fileInput.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        const validFiles = files.filter(file => 
            file.name.match(/\.(xlsx|xls|xlsm)$/i)
        );

        // Adiciona novos arquivos à lista
        validFiles.forEach(file => {
            if (!selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
                selectedFiles.push(file);
            }
        });

        updateFileList();
        updateImportButton();
    });

    function removeFile(fileName, fileSize) {
        selectedFiles = selectedFiles.filter(file => 
            !(file.name === fileName && file.size === fileSize)
        );
        updateFileList();
        updateImportButton();
    }

    function updateFileList() {
        fileList.innerHTML = '';
        
        if (selectedFiles.length === 0) {
            fileList.innerHTML = '<p class="text-muted text-center">Nenhum arquivo selecionado</p>';
            return;
        }

        selectedFiles.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'd-flex justify-content-between align-items-center border rounded p-3 mb-2';
            
            const fileInfo = document.createElement('div');
            fileInfo.className = 'd-flex align-items-center';
            
            const fileIcon = document.createElement('span');
            fileIcon.className = 'me-2 text-success';
            fileIcon.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-file-earmark-excel" viewBox="0 0 16 16">
                    <path d="M5.884 6.68a.5.5 0 1 0-.768.64L7.349 10l-2.233 2.68a.5.5 0 0 0 .768.64L8 10.781l2.116 2.54a.5.5 0 0 0 .768-.641L8.651 10l2.233-2.68a.5.5 0 0 0-.768-.64L8 9.219l-2.116-2.54z"/>
                    <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
                </svg>
            `;
            
            const fileName = document.createElement('span');
            fileName.className = 'fw-medium';
            fileName.textContent = file.name;
            
            fileInfo.appendChild(fileIcon);
            fileInfo.appendChild(fileName);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-sm btn-outline-danger';
            deleteBtn.innerHTML = 'Excluir';
            deleteBtn.onclick = function() {
                removeFile(file.name, file.size);
            };
            
            fileItem.appendChild(fileInfo);
            fileItem.appendChild(deleteBtn);
            fileList.appendChild(fileItem);
        });

        showAlert('info', 'Arquivos Selecionados', `${selectedFiles.length} arquivo(s) pronto(s) para upload.`);
    }

    function updateImportButton() {
        importBtn.disabled = selectedFiles.length === 0;
    }
});
