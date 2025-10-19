import { montarTabela } from "./montagem.js";

let campos_adicionados = []

$(document).ready(function () {
    const apiEndpointEstoque = 'http://127.0.0.1:5000/estoque';
    const apiEndpointTabela = 'http://127.0.0.1:5000/tabela';

    
    
    $.ajax({
        url: apiEndpointEstoque,
        type: 'GET',
        crossDomain: true,
        processData: false,
        contentType: false,
        timeout: 30000,
        
        success: function(response) {
            adicionarBotoesChaves(Object.keys(response[0]));
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
        }
    });

    // $.ajax({
    //     url: apiEndpointTabela,
    //     type: 'GET',
    //     crossDomain: true,
    //     processData: false,
    //     contentType: false,
    //     timeout: 30000,
        
    //     success: function(response) {
    //         adicionarBotoesChaves(Object.keys(response[0]));
    //     },
        
    //     error: function(xhr, status, error) {
    //         let errorMessage = 'Erro desconhecido';
            
    //         if (xhr.responseJSON && xhr.responseJSON.message) {
    //             errorMessage = xhr.responseJSON.message;
    //         } else if (error) {
    //             errorMessage = error;
    //         } else if (status === 'timeout') {
    //             errorMessage = 'Timeout - o servidor demorou muito para responder';
    //         }
    //     }
    // });
    
})

function adicionarBotoesChaves(chaves) {
    const container = $('#camposDisponiveis');

    let alias_class = {
        "Produto": "produto",
        "Codigo": "codigo",
        "Desconto": "desconto",
        "Descrição": "descricao",
        "EAN": "ean",
        "Estoque": "estoque",
        "Preço Base": "preco_base",
        "Categoria": "categoria",
        "Preço Final": "preco_final",
        "ST": "st",
        "Cód. Fornecedor": "cod_fornecedor",
        "Cód. Produto": "cod_produto",
        "Estoque Disponivel": "estoque_disponivel",
        "Estoque Existente": "estoque_existente",
        "Fornecedor": "fornecedor",
        "Estoque em Andamento": "estoque_andamento"
    }
    
    chaves.forEach(chave => {
        if (!campos_adicionados.includes(chave)){

            campos_adicionados.push(chave);
            const botao = $(`
                <button type="button" class="btn btn-primary m-1 ${alias_class[chave] || ''}">
                    ${chave}
                </button>
            `);
            
            // Adiciona funcionalidade de clique (opcional)
            botao.on('click', function() {
                console.log(`Botão clicado: ${chave}`);
                // Aqui você pode adicionar a lógica quando o botão for clicado

                montarTabela(alias_class[chave])
            });
            
            container.append(botao);
        }

    });
}
