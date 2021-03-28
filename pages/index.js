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
						"nome": "",
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
			modal: false
		}
		this.Load = this.Load.bind(this);
		this.LoadModal = this.LoadModal.bind(this);
		this.HandleChange = this.HandleChange.bind(this);
		this.SubmitModal = this.SubmitModal.bind(this);
	}
	componentDidMount() {
		FirstTime();
		this.Load();
	}
	Load() {
		let local = JSON.parse(localStorage.getItem('data'));
		let form = this.state.form;
		form.formType = { "nome": "Salário", "tipo": "Entrada" };
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
		let value = e.target.value;
		if (input === "formType") value = JSON.parse(value);
		data[input] = value;
		this.setState({ form: data })

	}
	SubmitModal(e) {
		e.preventDefault();
		let local = JSON.parse(localStorage.getItem('data'));
		let form = this.state.form
		let valor = parseFloat(form.formValue)

		let data = {
			"id": local.entradas.length > 0 ? local.entradas.length - 1 : 0,
			"descricao": form.formName,
			"categoria": form.formType,
			"valor": valor,
			"data": form.formDate
		}


		local.entradas.push(data);
		localStorage.setItem('data', JSON.stringify(local));
		this.LoadModal();
		this.Load();
	}
	RemoveEntry(index) {
		let localState = this.state.local;

		localState.entradas.splice(index, 1);
		localStorage.setItem('data', JSON.stringify(localState));
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
							<button onClick={this.LoadModal} className={styles.modalCloseButton}>
								<img src='./image/close.svg' />
							</button>
							<form onSubmit={this.SubmitModal} action='' className={styles.formAddEntry}>
								<select id='categoria' onChange={(e) => this.HandleChange(e, 'formType')}>
									{this.state.local.categorias.map((categoria, key) => <option key={key} value={JSON.stringify(categoria)}>{categoria.nome}</option>)}
								</select>
								<input type='text' id='descricao' placeholder='Descrição' onChange={(e) => this.HandleChange(e, 'formName')} />
								<input type='number' id='valor' placeholder='Valor' onChange={(e) => this.HandleChange(e, 'formValue')} pattern="[0-9]+([\.,][0-9]+)?" step="0.01" required />
								<input type='date' id='data' onChange={(e) => this.HandleChange(e, 'formDate')} required />
								<button type='submit'>Registrar</button>
							</form>
						</Modal>
					</div>

					<section className={styles.historyContainer}>
						<h1>Historico</h1>
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
									<button onClick={() => this.RemoveEntry(item.id)}>
										<img src='./image/close.svg' />
									</button>
								</li>
							})}
						</ul>
					</section>
				</main>
			</div>
		)
	}
}
