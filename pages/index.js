import Head from 'next/head';
import React from 'react';
import styles from '../styles/Home.module.css';
import stylesForm from '../styles/Form.module.css';
import Card from './components/card';
import History from './components/history';
import Modal from './components/modal';
import { FirstTime } from './../script/dataManager';
import ContextApi from './contextApi';
import CardContainer from './components/cardContainer';
import ButtonClose from './components/buttonClose';


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
			historyFilter: {
				"data": {
					"date": ""
				},
				"valor": false
			},
			menu: {
				"ativo": false,
				"index": 0,
				"descricao": "",
				"categoria": "",
				"valor": 0,
				"data": ''

			},
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
	render() {
		return (
			<ContextApi.Provider value={this}>
				<div className={styles.container}>
					<Head>
						<title>Finanças</title>
						<link rel="icon" href="/favicon.ico" />
					</Head>
					<main className={styles.main}>
						<CardContainer history={this.state.history} category={this.state.local.categorias}/>
						<div>

							<Modal modalOn={this.state.modal} blur='5'>

								<form onSubmit={this.SubmitModal} action='' className={stylesForm.formAddEntry}>
									<ButtonClose Click={this.LoadModal} />
									<select id='category' value={this.state.form.categoria} onChange={(e) => this.HandleChange(e.target.value, 'formType')}>
										{this.state.local.categorias.map((categoria, key) => <option key={key} value={JSON.stringify(categoria)} style={{ background: categoria.tipo === 'Entrada' ? '#38c183' : '#e05f5f' }}>{categoria.nome}</option>)}
									</select>
									<input type='text' id='descricao' placeholder='Descrição' onChange={(e) => this.HandleChange(e.target.value, 'formName')} />
									<input type='number' id='valor' placeholder='Valor' onChange={(e) => this.HandleChange(e.target.value, 'formValue')} pattern="[0-9]+([\.,][0-9]+)?" step="0.01" required />
									<input type='date' id='data' onChange={(e) => this.HandleChange(e.target.value, 'formDate')} required />
									<button type='submit' className={stylesForm.add} >Registrar</button>
								</form>
							</Modal>
						</div>

						<History />
					</main>
				</div>
			</ContextApi.Provider>
		)
	}
}
