import React from 'react';
import Modal from './modal';
import styles from './../../styles/History.module.css';
import stylesForm from './../../styles/Form.module.css';
import { ContextApi } from './../contextApi';
import HistoryList from './historyList';
import ButtonClose from './buttonClose';
class History extends React.Component {
    constructor(props) {
        super(props);
        this.HandleChangeMenu = this.HandleChangeMenu.bind(this);
        this.HistoryDateFilter = this.HistoryDateFilter.bind(this);
        this.LoadEntryMenu = this.LoadEntryMenu.bind(this);
        this.SubmitEntryMenu = this.SubmitEntryMenu.bind(this);
        this.RemoveEntry = this.RemoveEntry.bind(this);
    }

    GetCurrentDate(date) {
        let d = new Date(date);
        let actualDate = new Date(d.getTime() - d.getTimezoneOffset() * -60000);
        return actualDate;
    }
    HistoryDateFilter() {
        let year = document.getElementById('filterYear').value;
        let month = document.getElementById('filterMonth').value;
        let date = new Date(year, month, '01');
        let filter = this.context.state.historyFilter;
        filter.data.date = this.GetCurrentDate(date);
        this.context.setState({ historyFilter: filter })
        this.context.Load();
    }
    HandleChangeMenu(e, input) {
        let data = this.context.state.menu;
        let value = e.target.value;
        if (input === "categoria") value = JSON.parse(value);
        data[input] = value;
        this.setState({ menu: data })

    }
    LoadEntryMenu(item) {
        let menu = this.context.state.menu;
        menu.ativo = !menu.ativo;
        if (menu.ativo) {
            menu.index = item.id;
            menu.categoria = item.categoria;
            menu.descricao = item.descricao;
            menu.valor = item.valor;
            menu.data = item.data;
        }
        this.setState({ menu: menu });
    }
    SubmitEntryMenu(e) {
        e.preventDefault();
        let local = this.context.state.local;
        local.entradas[this.context.state.menu.index] = {
            "descricao": this.context.state.menu.descricao,
            "categoria": this.context.state.menu.categoria,
            "valor": parseFloat(this.context.state.menu.valor),
            "data": this.context.state.menu.data
        }
        localStorage.setItem('data', JSON.stringify(local));
        this.LoadEntryMenu();
        this.context.Load();
    }
    RemoveEntry() {
        let localState = this.context.state.local;
        localState.entradas.splice(this.context.state.menu.index, 1);
        localStorage.setItem('data', JSON.stringify(localState));
        this.LoadEntryMenu();
        this.context.Load();
    }
    render() {
        return (
            <section className={styles.historyContainer}>
                <div className={styles.historyContainerFilter}>
                    <section>
                        <h1>Histórico</h1>
                        <button onClick={this.context.LoadModal} className={styles.modalOpenButton}>
                            <img src='./image/plus.svg' />
                        </button>
                    </section>
                    <div className={styles.historyFilter}>
                        <input type='number' id='filterYear' onKeyDown={(e) => e.preventDefault()} onClick={this.HistoryDateFilter} />
                        <div></div>
                        <select id="filterMonth" onChange={this.HistoryDateFilter}>
                            <option value='0'>Jan</option>
                            <option value='1'>Fev</option>
                            <option value='2'>Mar</option>
                            <option value='3'>Abr</option>
                            <option value='4'>Mai</option>
                            <option value='5'>Jun</option>
                            <option value='6'>Jul</option>
                            <option value='7'>Ago</option>
                            <option value='8'>Set</option>
                            <option value='9'>Out</option>
                            <option value='10'>Nov</option>
                            <option value='11'>Dez</option>
                        </select>
                    </div>
                </div>
                <HistoryList history={this.context.state.history} state={this}/>
                <Modal modalOn={this.context.state.menu.ativo}>
                    <form onSubmit={this.SubmitEntryMenu} action='' className={stylesForm.formAddEntry}>
                        <ButtonClose Click={this.LoadEntryMenu} />
                        <select id='edit-select-category' value={JSON.stringify(this.context.state.menu.categoria)} onChange={(e) => this.HandleChangeMenu(e, 'categoria')} >
                            {this.context.state.local.categorias.map(
                                (categoria, key) => <option key={key}
                                    value={JSON.stringify(categoria)}
                                    style={{ background: categoria.tipo === 'Entrada' ? '#38c183' : '#e05f5f' }}>
                                    {categoria.nome}
                                </option>
                            )}
                        </select>
                        <input type='text' id='select-descricao' placeholder='Descrição' value={this.context.state.menu.descricao} onChange={(e) => this.HandleChangeMenu(e, 'descricao')} />
                        <input type='number' id='select-valor' placeholder='Valor' value={this.context.state.menu.valor} onChange={(e) => this.HandleChangeMenu(e, 'valor')} pattern="[0-9]+([\.,][0-9]+)?" step="0.01" required />
                        <input type='date' id='select-data' value={this.context.state.menu.data} onChange={(e) => this.HandleChangeMenu(e, 'data')} required />
                        <div className={stylesForm.buttons}>
                            <button type='submit' className={stylesForm.add}>Alterar</button>
                            <button type='button' className={stylesForm.delete} onClick={this.RemoveEntry}>Remover</button>
                        </div>
                    </form>
                </Modal>
            </section>
        )
    }
}
History.contextType = ContextApi;

export default History;