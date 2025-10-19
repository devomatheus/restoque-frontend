$(document).ready(function() {
    const apiEndpointEstoque = 'http://127.0.0.1:5000/estoque';
    let columnVisibility = [true, true, true, true, true, true, true, true, true, true];
    var produtos = [];
    var itensPorPagina = 10;
    var paginaAtual = 1;
    var totalPaginas = 1;

    let alias_campos = {
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

    function preencherTabela(produtos, inicio, fim) {
        const itensPagina = produtos.slice(inicio, fim);
        const colunasIgnore = ['id', 'internal_code']; // Campos a ignorar

        // Obter colunas dinamicamente do primeiro item
        const colunas = Object.keys(produtos[0]).filter(
            col => !colunasIgnore.includes(col)
        );
 
        // Criar cabeçalho dinâmico (se necessário)
        const thead = document.querySelector('table thead');
        if (!thead.querySelector('tr')) {
            const headerRow = colunas
            .map(col => `<th>${formatarNome(col)}</th>`)
            thead.innerHTML = `<tr>${headerRow}</tr>`;
        }
        
        // Preencher corpo da tabela
        const tbody = itensPagina.map((item, index) => {
            const celulas = colunas
            .map(col => `<td>${item[col] ?? '-'}</td>`)
            .join('');

            return `<tr>
            ${celulas}
            </tr>`;
        }).join('');

        document.querySelector('table tbody').innerHTML = tbody;
    }

    // Função auxiliar para formatar nomes das colunas
    function formatarNome(coluna) {
        console.log('coluna: '+coluna)
        return coluna
            .split('_')
            .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
            .join(' ');
    }

    function atualizarTabelaEPaginacao() {
        renderTabela(paginaAtual);
        renderPaginacao();
    }

    function renderTabela(pagina) {
        var inicio = (pagina - 1) * itensPorPagina;
        var fim = inicio + itensPorPagina;
        var itensPagina = produtos.slice(inicio, fim);
        var tbody = '';

        preencherTabela(itensPagina, inicio, fim)
        // itensPagina.forEach(function (item) {
        //     tbody += `<tr>
        //         <td>${item.Categoria}</td>
        //         <td>${item.Cód. Fornecedor}</td>
        //         <td>${item.em_andamento}</td>
        //         <td>${item.existente}</td>
        //         <td>${item.disponivel}</td>
        //         <td>
        //             <button class='btn btn-sm btn-outline-primary btn-editar' data-index='${inicio + itensPagina.indexOf(item)}'><i class='bi bi-pencil'></i></button>
        //                 <button class='btn btn-sm btn-outline-danger btn-apagar' data-index='${inicio + itensPagina.indexOf(item)}'><i class='bi bi-trash'></i></button>
        //         </td>
        //     </tr>`;
        // });
        // $('table tbody').html(tbody);

        updateColumnVisibility()
    }

    function renderPaginacao() {
        var paginacao = '';
        paginacao += `<li class="page-item${paginaAtual === 1 ? ' disabled' : ''}">
        <a class="page-link" href="#" data-page="anterior" tabindex="-1">Anterior</a>
    </li>`;
        for (var i = 1; i <= totalPaginas; i++) {
            paginacao += `<li class="page-item${paginaAtual === i ? ' active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
        }
        paginacao += `<li class="page-item${paginaAtual === totalPaginas ? ' disabled' : ''}">
        <a class="page-link" href="#" data-page="proxima">Próxima</a>
    </li>`;
        $('.pagination').html(paginacao);
    }

    function updateColumnVisibility() {
        // Atualiza o cabeçalho
        $('#data-table thead th').each(function(index) {
            if (columnVisibility[index]) {
                $(this).removeClass('d-none');
            } else {
                $(this).addClass('d-none');
            }
        });
        
        // Atualiza as células do corpo
        $('#data-table tbody tr').each(function() {
            $(this).find('td').each(function(index) {
                if (columnVisibility[index]) {
                    $(this).removeClass('d-none');
                } else {
                    $(this).addClass('d-none');
                }
            });
        });
    }
    
    $.ajax({
        url: apiEndpointEstoque,
        type: 'GET',
        crossDomain: true,
        processData: false,
        contentType: false,
        timeout: 30000,
        
        success: function(response) {
            produtos = response;
            totalPaginas = Math.ceil(produtos.length / itensPorPagina);
            paginaAtual = 1;
            
            atualizarTabelaEPaginacao();

            // $('#loading-message').addClass('d-none');
            let tabela = $('#data-table')
            console.log('tabela sendo executada'+tabela)
            tabela.removeClass('d-none');
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
})


