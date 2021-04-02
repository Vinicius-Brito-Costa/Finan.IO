import Head from 'next/head'
import React from 'react';
import styles from '../styles/Home.module.css'
import Card from './components/card';
import Modal from './components/modal';
import { FirstTime } from './script/dataManager';

export default class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			local: {
				"entradas": [
					{
						"descricao": "",
						"categoria": "",
						"valor": 0,
						"data": ""
					}
				],
				"categorias": [],
				"config": {
					"date": "ano-mes-dia"
				}
			},
			history: [],
			form: {
				"formName": '',
				"formValue": 0,
				"formType": {},
				"formDate": ''
			},
			modal: false,
			menu: {
				"ativo": false,
				"index": 0,
				"descricao": "",
				"categoria": "",
				"valor": 0,
				"data": ''

			},
			historyFilter: {
				"data": {
					"date": ""
				},
				"valor": false
			}
		}
		this.Load = this.Load.bind(this);
		this.LoadModal = this.LoadModal.bind(this);
		this.HistoryDateFilter = this.HistoryDateFilter.bind(this);
		this.HandleChange = this.HandleChange.bind(this);
		this.SubmitModal = this.SubmitModal.bind(this);
		this.LoadEntryMenu = this.LoadEntryMenu.bind(this);
		this.SubmitEntryMenu = this.SubmitEntryMenu.bind(this);
		this.RemoveEntry = this.RemoveEntry.bind(this);
	}
	componentDidMount() {
		FirstTime();
		this.Load();
	}
	Load() {
		let local = JSON.parse(localStorage.getItem('data'));
		let form = this.state.form;
		let history = this.CreateHistory(local.entradas, this.state.historyFilter.data);
		history.sort((data1, data2) => {
			let a = new Date(data1.data);
			let b = new Date(data2.data);
			return a - b;
		})
		history.reverse();
		let formTypeDoesNotExist = !form.formType.nome;
		if (formTypeDoesNotExist) form.formType = local.categorias[0];
		this.setState({
			local: local,
			form: form,
			history: history
		})
	}
	CreateHistory(list, date) {
		let copy = []
		let actualDate = date.date === '' ? new Date() : new Date(date.date);
		let compareDate = {
			"year": actualDate.getFullYear(),
			"month": actualDate.getMonth()
		}
		let index = 0;

		for (let item of list) {
			let itemDate = this.GetCurrentDate(item.data);
			let itemCompareDate = {
				"year": itemDate.getFullYear(),
				"month": itemDate.getMonth()
			}
			if (itemCompareDate.year === compareDate.year && itemCompareDate.month === compareDate.month) {
				item.id = index;
				copy.push(item);
			}
			index++;
		}
		document.getElementById('filterYear').value = actualDate.getFullYear();
		document.getElementById('filterMonth').value = actualDate.getMonth();
		return copy
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
		let filter = this.state.historyFilter;
		filter.data.date = this.GetCurrentDate(date);
		this.setState({ historyFilter: filter })
		this.Load();
	}
	LoadProfit(entradas) {
		let valor = 0;
		for (let entrada of entradas) {
			if (entrada.categoria.tipo === 'Entrada') {
				valor += entrada.valor;
			}
		}
		return valor;
	}
	LoadLoss(saidas) {
		let valor = 0;
		for (let saida of saidas) {
			if (saida.categoria.tipo !== 'Entrada') {
				valor += saida.valor;
			}
		}
		return valor;
	}
	LoadBalance(lista) {
		let entry = this.LoadProfit(lista);
		let loss = this.LoadLoss(lista);
		return entry - loss;
	}
	LoadModal() {
		let modal = this.state.modal;
		this.setState({ modal: !modal });
	}
	HandleChange(e, input) {
		let data = this.state.form;
		let value = e;
		if (input === "formType") {
			value = JSON.parse(value);

		}
		data[input] = value;
		this.setState({ form: data })

	}
	SubmitModal(e) {
		e.preventDefault();
		let local = JSON.parse(localStorage.getItem('data'));
		let form = this.state.form
		let valor = parseFloat(form.formValue)
		if (typeof form.formType === 'string') JSON.stringify(form.formType);
		let data = {
			"descricao": form.formName,
			"categoria": form.formType,
			"valor": valor,
			"data": form.formDate
		}


		local.entradas.push(data);
		local.entradas.sort((data1, data2) => {
			let a = new Date(data1.data);
			let b = new Date(data2.data);
			return a - b;
		})
		localStorage.setItem('data', JSON.stringify(local));
		this.Load();
		this.LoadModal();
	}
	HandleChangeMenu(e, input) {
		let data = this.state.menu;
		let value = e.target.value;
		if (input === "categoria") value = JSON.parse(value);
		data[input] = value;
		this.setState({ menu: data })

	}
	LoadEntryMenu(item) {
		let menu = this.state.menu;
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
		let local = this.state.local;
		local.entradas[this.state.menu.index] = {
			"descricao": this.state.menu.descricao,
			"categoria": this.state.menu.categoria,
			"valor": parseFloat(this.state.menu.valor),
			"data": this.state.menu.data
		}
		localStorage.setItem('data', JSON.stringify(local));
		this.LoadEntryMenu();
		this.Load();
	}
	RemoveEntry() {
		let localState = this.state.local;
		localState.entradas.splice(this.state.menu.index, 1);
		localStorage.setItem('data', JSON.stringify(localState));
		this.LoadEntryMenu();
		this.Load();
	}
	render() {
		return (
			<div className={styles.container}>
				<Head>
					<title>Finanças</title>
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<main className={styles.main}>
					<header >
						<Card valor={this.LoadProfit(this.state.history)} type='Entrada'></Card>
						<Card valor={this.LoadLoss(this.state.history)} type='Saida'></Card>
						<Card valor={this.LoadBalance(this.state.history)} ></Card>
					</header>
					<div>
						<button onClick={this.LoadModal} className={styles.modalOpenButton}>
							<img src='./image/plus.svg' />
						</button>
						<Modal modalOn={this.state.modal} blur='5'>

							<form onSubmit={this.SubmitModal} action='' className={styles.formAddEntry}>
								<button type='button' onClick={this.LoadModal} className={styles.modalCloseButton}>
									<img src='./image/close.svg' />
								</button>
								<select id='category' value={this.state.form.categoria} onChange={(e) => this.HandleChange(e.target.value, 'formType')}>
									{this.state.local.categorias.map((categoria, key) => <option key={key} value={JSON.stringify(categoria)} style={{ background: categoria.tipo === 'Entrada' ? '#38c183' : '#e05f5f' }}>{categoria.nome}</option>)}
								</select>
								<input type='text' id='descricao' placeholder='Descrição' onChange={(e) => this.HandleChange(e.target.value, 'formName')} />
								<input type='number' id='valor' placeholder='Valor' onChange={(e) => this.HandleChange(e.target.value, 'formValue')} pattern="[0-9]+([\.,][0-9]+)?" step="0.01" required />
								<input type='date' id='data' onChange={(e) => this.HandleChange(e.target.value, 'formDate')} required />
								<button type='submit' className={styles.add} >Registrar</button>
							</form>
						</Modal>
					</div>

					<section className={styles.historyContainer}>
						<div className={styles.historyContainerFilter}>
							<h1>Histórico</h1>
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
						<ul className={styles.history}>
							<li className={styles.historyMenu}>
								<div>Tipo</div>
								<div>Descrição</div>
								<div>Categoria</div>
								<div>Valor</div>
								<div>Data</div>
								<div></div>
							</li>
							{this.state.history.map((item, key) => {
								let date = this.GetCurrentDate(item.data);
								let dia = date.getDate();
								let mes = date.getMonth() + 1;
								let ano = date.getFullYear();
								let dataEntrada = String(dia).padStart(2, '0') + "/" + String(mes).padStart(2, '0') + '/' + ano;
								return <li key={key}>
									<h3>{item.categoria.tipo}</h3>
									<h3>{item.descricao}</h3>
									<h3>{item.categoria.nome}</h3>
									<h3>{item.valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</h3>
									<h3>{dataEntrada}</h3>
									<button onClick={() => this.LoadEntryMenu(item, key)}>
										<img src='./image/more.svg' />
									</button>
								</li>
							})}
						</ul>
						<Modal modalOn={this.state.menu.ativo}>
							<form onSubmit={this.SubmitEntryMenu} action='' className={styles.formAddEntry}>
								<button type='button' onClick={this.LoadEntryMenu} className={styles.modalCloseButton}>
									<img src='./image/close.svg' />
								</button>
								<select id='edit-select-category' value={JSON.stringify(this.state.menu.categoria)} onChange={(e) => this.HandleChangeMenu(e, 'categoria')} >
									{this.state.local.categorias.map(
										(categoria, key) => <option key={key}
											value={JSON.stringify(categoria)}
											style={{ background: categoria.tipo === 'Entrada' ? '#38c183' : '#e05f5f' }}>
											{categoria.nome}
										</option>
									)}
								</select>
								<input type='text' id='select-descricao' placeholder='Descrição' value={this.state.menu.descricao} onChange={(e) => this.HandleChangeMenu(e, 'descricao')} />
								<input type='number' id='select-valor' placeholder='Valor' value={this.state.menu.valor} onChange={(e) => this.HandleChangeMenu(e, 'valor')} pattern="[0-9]+([\.,][0-9]+)?" step="0.01" required />
								<input type='date' id='select-data' value={this.state.menu.data} onChange={(e) => this.HandleChangeMenu(e, 'data')} required />
								<div className={styles.buttons}>
									<button type='submit' className={styles.add}>Alterar</button>
									<button type='button' className={styles.delete} onClick={this.RemoveEntry}>Remover</button>
								</div>
							</form>
						</Modal>
					</section>
				</main>
			</div>
		)
	}
}
