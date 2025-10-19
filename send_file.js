import { showAlert } from './alertas.js';

function uploadSingleFile(file) {
    const apiEndpoint = 'http://127.0.0.1:5000/importar';
    return new Promise(function(resolve, reject) {
        const formData = new FormData();
        formData.append('arquivo', file);
        
        $.ajax({
            url: apiEndpoint,
            type: 'POST',
            crossDomain: true,
            data: formData,
            processData: false,
            contentType: false,
            timeout: 30000, // 30 segundos
            
            success: function(response) {
                resolve(response);
            },
            
            error: function(xhr, status, error) {
                let errorMessage = 'Erro desconhecido';
                
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMessage = xhr.responseJSON.message;
                } else if (error) {
                    errorMessage = error;
                } else if (status === 'timeout') {
                    errorMessage = 'Timeout - o servidor demorou muito para responder';
                }
                
                reject(errorMessage);
            }
        });
    });
}

function uploadFilesSequentially(files) {
    let currentIndex = 0;
    const totalFiles = files.length;
    
    if (currentIndex >= totalFiles) {
        console.log('Todos os arquivos foram processados!', 'success');
        resetFileInput();
        return;
    }
    
    const currentFile = files[currentIndex];
    currentIndex++;

    uploadSingleFile(currentFile)
    .then(function(response) {
        showAlert('success', 'Importação realizada', `${currentFile.name} - Upload concluído`);
    })
    .catch(function(error) {
        showAlert('error', "Importação falhou", `${currentFile.name} - Erro: ${error}`);
    });
}

function validateFile(file) {
    // Verifica se é um arquivo Excel pela extensão
    const allowedExtensions = ['xlsx', 'xls', 'xlsm'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
        return {
            isValid: false,
            message: 'Tipo de arquivo não permitido. Use .xlsx, .xls ou .xlsm'
        };
    }
    
    // Verifica o tipo MIME (opcional, mas adicional)
    const excelMimeTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel.sheet.macroEnabled.12'
    ];
    
    if (file.type && !excelMimeTypes.includes(file.type)) {
        return {
            isValid: false,
            message: 'Tipo MIME não corresponde a um arquivo Excel'
        };
    }
    
    return { isValid: true, message: 'Arquivo válido' };
}

function processFiles(files) {
    const validFiles = [];
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const validation = validateFile(file);
        
        if (validation.isValid) {
            validFiles.push(file);
        } else {
            console.log(`Arquivo rejeitado: ${file.name} - ${validation.message}`, 'error');
        }
    }
    
    if (validFiles.length === 0) {
        console.log('Nenhum arquivo válido para upload.', 'error');
        return;
    }
    
    uploadFilesSequentially(validFiles);
}

$("#importBtn").on("click", function(e) {
    const fileInput = $('#excelFiles');
    const files = fileInput.prop('files');

    if (files.length === 0) {
        console.log('Nenhum arquivo selecionado.', 'error');
        return;
    }

    processFiles(files);

    setTimeout(() => {
        window.location.href = './dashboard.html'
    }, 10000);

})
