import { useState, useEffect } from 'react';
import Card from './card';
import styles from './../../styles/CardContainer.module.css';
import Modal from './modal';
import HistoryList from './historyList';
import ButtonClose from './buttonClose';

export default function CardContainer(props) {
    const itemCount = props.category.length;
    const [expand, setExpand] = useState(false);
    const [modal, setModal] = useState([false]);
    const [modalData, setModalData] = useState([]);
    const Expand = () => {
        setExpand(!expand);
        ButtonRotate();
    }
    const ButtonRotate = () => {
        if (expand === false) {
            document.getElementById('expandButton').style.transform = 'rotate(0deg)';
        }
        else if (expand === true) {
            document.getElementById('expandButton').style.transform = 'rotate(180deg)';
        }
    }

    const LoadProfit = (entradas) => {
        let valor = 0;
        for (let entrada of entradas) {
            if (entrada.categoria.tipo === 'Entrada') {
                valor += entrada.valor;
            }
        }
        return valor;
    }
    const LoadLoss = (saidas) => {
        let valor = 0;
        for (let saida of saidas) {
            if (saida.categoria.tipo !== 'Entrada') {
                valor += saida.valor;
            }
        }
        return valor;
    }
    const LoadBalance = (lista) => {
        let entry = LoadProfit(lista);
        let loss = LoadLoss(lista);
        return entry - loss;
    }
    const LoadCategory = (lista, nome) => {
        let valor = 0;
        let data = [];
        for (let item of lista) {
            if (item.categoria.nome === nome) {
                valor += item.valor;
                data.push(item);
            }
        }
        return { "value": valor, "data": data };
    }
    const ModalControl = (value, data) => {
        setModal(value);
        setModalData(data);
    }
    return (
        <div>
            <div className={styles.container} style={{ maxHeight: expand ? 155 + Math.max(180 * (itemCount / 3)) + 80 : "155px" }}>
                <header className={styles.cardContainer}>
                    <Card valor={LoadProfit(props.history)} type='Entrada'></Card>
                    <Card valor={LoadLoss(props.history)} margin={true} type='Saida'></Card>
                    <Card valor={LoadBalance(props.history)} type='Balanco'></Card>
                </header>
                <section className={styles.categoryContainer}>
                    {props.category.map((item, key) => {
                        let load = LoadCategory(props.history, item.nome);
                        let value = load.value
                        let data = load.data;
                        let card = <Card valor={value} type={item.nome} cursor={true} />;
                        return <div key={key} onClick={() => ModalControl(true, data)}>{card}</div>;
                    })}

                </section>
                <Modal modalOn={modal} blur='10' bgColor={'rgba(0,0,0, .5)'}>
                    <div style={{width: 960, display: 'flex', flexDirection: 'column', alignItems: 'end'}}>
                        <ButtonClose Click={() => ModalControl(false, modalData)} />
                        <HistoryList history={modalData} />
                    </div>
                </Modal>
            </div>
            <div className={styles.categoryButton}>
                <img src='./image/up-arrow.svg' id='expandButton' onClick={Expand} style={{ width: '20px', margin: 'auto', display: 'block', transform: 'rotate(180deg)', transition: 'transform .2s ease-in-out' }} />
            </div>
        </div>
    )

}