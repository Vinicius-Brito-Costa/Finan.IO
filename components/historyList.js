import styles from './../styles/HistList.module.css';
export default function HistoryList(props) {
    const GetCurrentDate = (date) => {
        let d = new Date(date);
        let actualDate = new Date(d.getTime() - d.getTimezoneOffset() * -60000);
        return actualDate;
    }
    let Button = props.button;
    return (
        <ul className={styles.history}>
            <li className={styles.historyMenu}>
                <div>Tipo</div>
                <div>Descrição</div>
                <div>Categoria</div>
                <div>Valor</div>
                <div>Data</div>
                {props.state ? <div className={styles.historyMenuBlank}></div> : ''}
            </li>
            {props.history.map((item, key) => {
                let date = GetCurrentDate(item.data);
                let dia = date.getDate();
                let mes = date.getMonth() + 1;
                let ano = date.getFullYear();
                let dataEntrada = String(dia).padStart(2, '0') + "/" + String(mes).padStart(2, '0') + '/' + ano;
                return <li key={key}>
                    <h3>{item.categoria.tipo}</h3>
                    <h3>{item.descricao}</h3>
                    <h3>{item.categoria.nome.replace(' ', "\u00A0")}</h3>
                    <h3>{item.valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</h3>
                    <h3>{dataEntrada}</h3>
                    {props.state ? <button onClick={() => props.state.LoadEntryMenu(item, key)}>
                        <img src='./image/more.svg' />
                    </button> : ''}
                </li>
            })}
        </ul>
    )
}