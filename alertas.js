export function showAlert(type, title, message) {
    // Verifica se o iziToast está disponível globalmente (não através do jQuery)
    if (typeof iziToast === 'undefined') {
        console.error('iziToast não está carregado!');
        // Fallback para alertas nativos
        const nativeTypes = {
            'success': '✅',
            'error': '❌',
            'warning': '⚠️',
            'info': 'ℹ️'
        };
        alert(`${nativeTypes[type] || ''} ${title}: ${message}`);
        return;
    }

    // Configurações base
    const baseSettings = {
        title: title,
        message: message,
        position: 'topRight',
        timeout: 5000,
        closeOnClick: true,
        displayMode: 'replace'
    };

    // Configurações específicas por tipo
    const typeSettings = {
        info: {
            icon: 'fas fa-info-circle',
            backgroundColor: '#3498db',
            iconColor: 'white'
        },
        success: {
            icon: 'fas fa-check-circle',
            backgroundColor: '#2ecc71',
            iconColor: 'white'
        },
        warning: {
            icon: 'fas fa-exclamation-triangle',
            backgroundColor: '#f39c12',
            iconColor: 'white'
        },
        error: {
            icon: 'fas fa-exclamation-circle',
            backgroundColor: '#e74c3c',
            iconColor: 'white'
        }
    };

    // Combinar configurações
    const settings = {...baseSettings, ...typeSettings[type]};

    // Exibir o toast usando iziToast global
    iziToast.show(settings);
}