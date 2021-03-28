import Head from 'next/head'
import React from 'react';
import styles from '../styles/Home.module.css'
import Card from './components/card';
import Modal from './components/modal';
import { FirstTime, AddProfit, AddLoss } from './script/dataManager';

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
				"categorias": []
			},
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

			}
		}
		this.Load = this.Load.bind(this);
		this.LoadModal = this.LoadModal.bind(this);
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
		local.entradas.sort((data1, data2) => {
			let a = new Date(data1.data);
			let b = new Date(data2.data);
			return a - b;
		})
		if(form.formType === {}) form.formType = local.categorias[0];
		
		this.setState({
			local: local,
			form: form,
		})
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
		if(typeof form.formType === 'string') JSON.stringify(form.formType);
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
	LoadEntryMenu(item, index) {
		let menu = this.state.menu;
		menu.ativo = !menu.ativo;
		if (menu.ativo) {
			menu.index = index;
			menu.categoria = item.categoria;
			menu.descricao = item.descricao;
			menu.valor = item.valor;
			menu.data = item.data;
		}
		this.setState({ menu: menu });
	}
	SubmitEntryMenu(e){
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
						<Card valor={this.LoadProfit(this.state.local.entradas)} type='Entrada'></Card>
						<Card valor={this.LoadLoss(this.state.local.entradas)} type='Saida'></Card>
						<Card valor={this.LoadBalance(this.state.local.entradas)} ></Card>
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
								<button type='submit'>Registrar</button>
							</form>
						</Modal>
					</div>

					<section className={styles.historyContainer}>
						<h1>Histórico</h1>
						<ul className={styles.history}>
							{this.state.local.entradas.map((item, key) => {
								let dia = new Date(item.data).getDate() + 1;
								let mes = new Date(item.data).getMonth() + 1;
								let ano = new Date(item.data).getFullYear();
								let dataEntrada = dia + "/" + mes + '/' + ano;
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
								<div>
									<button type='submit'>Alterar</button>
									<button type='button' onClick={this.RemoveEntry}>Remover</button>
								</div>
							</form>
						</Modal>
					</section>
				</main>
			</div>
		)
	}
}
