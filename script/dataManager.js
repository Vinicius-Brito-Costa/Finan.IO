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
                "tipo": "Saída"
            },
            {
                "nome": "Lazer",
                "tipo": "Saída"
            },
            {
                "nome": "Reserva de Emergência",
                "tipo": "Saída"
            },
            {
                "nome": "Investimentos e Estudos",
                "tipo": "Saída"
            },
        ],
        "config": {
            "date": {
                "custom": false,
                "date": "ano-mes-dia"
            }
        }
    }
    localStorage.setItem('data', JSON.stringify(data));
}