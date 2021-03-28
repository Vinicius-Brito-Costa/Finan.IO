let log = console.log;
export function FirstTime(){
    let data = window.localStorage.getItem('data');
    if(!data){
        Create();
    }
}
export function Create(){
    let data = {
        'entradas': [],
        'categorias':[
            {
                "nome": "Salário",
                "tipo": "Entrada"
            },
            {
                "nome": "Renda Extra",
                "tipo": "Entrada"
            },
            {
                "nome": "Contas",
                "tipo": "Saida"
            },
            {
                "nome": "Lazer",
                "tipo": "Saida"
            },
            {
                "nome": "Reserva de Emergência",
                "tipo": "Reserva"
            },
            {
                "nome": "Investimentos e Estudos",
                "tipo": "Entrada"
            },
        ]
    }
    localStorage.setItem('data', JSON.stringify(data));
}
export function Balance(){
    let local = JSON.parse(localStorage.getItem('data'));
    let valor = 0;

    if(local.entradas.length > 0) for(let entrada of local.entradas) valor += entrada.valor;
    else valor += 0;
    if(local.saidas.length > 0) for(let saida of local.saidas) valor -= saida.valor;
    else valor -= 0;
    
    let data = {
        'saldo'     : valor,
        'entradas'  : local.entradas,
        'saidas'    : local.saidas,
        'categorias': local.categorias
    }

    localStorage.setItem('data', JSON.stringify(data));
    log(valor);
}
export function AddProfit(profit){
    let local = JSON.parse(localStorage.getItem('data'));
    
    local.entradas.push(profit);
    log(local);
    let data = {
        'saldo'     : valor,
        'entradas'  : local.entradas,
        'saidas'    : local.saidas,
        'categorias': local.categorias
    }
    localStorage.setItem('data', JSON.stringify(data));
    Balance();
}
export function RemoveProfit(index){
    let local = JSON.parse(localStorage.getItem('data'));
    
    local.entradas.splice(index, 1);
    log(local);
    let data = {
        'saldo'     : valor,
        'entradas'  : local.entradas,
        'saidas'    : local.saidas,
        'categorias': local.categorias
    }
    localStorage.setItem('data', JSON.stringify(data));
    Balance();
}
export function AddLoss(profit){
    let local = JSON.parse(localStorage.getItem('data'));
    
    local.saidas.push(profit);
    log(local);
    let data = {
        'saldo'     : valor,
        'entradas'  : local.entradas,
        'saidas'    : local.saidas,
        'categorias': local.categorias
    }
    localStorage.setItem('data', JSON.stringify(data));
    Balance();
}
export function RemoveLoss(index){
    let local = JSON.parse(localStorage.getItem('data'));
    
    local.saidas.splice(index, 1);
    log(local);
    let data = {
        'saldo'     : valor,
        'entradas'  : local.entradas,
        'saidas'    : local.saidas,
        'categorias': local.categorias
    }
    localStorage.setItem('data', JSON.stringify(data));
    Balance();
}
export function AddCategory(category){
    let local = JSON.parse(localStorage.getItem('data'));
    
    local.categorias.push(category);
    log(local);
    let data = {
        'saldo'     : valor,
        'entradas'  : local.entradas,
        'saidas'    : local.saidas,
        'categorias': local.categorias
    }
    localStorage.setItem('data', JSON.stringify(data));
    Balance();
}
export function RemoveCategory(index){
    let local = JSON.parse(localStorage.getItem('data'));
    
    local.categorias.splice(index, 1);
    log(local);
    let data = {
        'saldo'     : valor,
        'entradas'  : local.entradas,
        'saidas'    : local.saidas,
        'categorias': local.categorias
    }
    localStorage.setItem('data', JSON.stringify(data));
    Balance();
}