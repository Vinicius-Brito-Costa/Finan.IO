import { Component } from 'react';
import styles from './../../styles/Card.module.css';

export default class Card extends Component{
    constructor(props){
        super(props);
        this.state = {
            type: 'Saldo',
            color: 'white',
            text: '2',
            amount: 0,
            icon: 'wallet',
            anim: 'profit'
        }
        this.CardType = this.CardType.bind(this);
    }
    componentDidMount(){
        this.CardType();
    }
    CardType(){
        if(this.props.type === 'Entrada'){
            this.setState({icon: 'profit', type: 'Entrada', anim: 'profit'});
        }
        else if(this.props.type === 'Saida'){
            this.setState({icon: 'loss', type: 'Saída', anim: 'loss'});
        }
        else{
            this.setState({color: 'green',text: '1', anim: 'balance'})
        }
    }
    render(){
        return(
            <section className={styles.container} style={{backgroundColor: `var(--${this.state.color})`}}>
                <div className={styles.info} style={{color: `var(--text-color-${this.state.text})`}}>
                    <div>{this.state.type}</div>
                    <h1>{this.props.valor.toLocaleString('pt-br', {style:'currency', currency:'BRL'})}</h1>
                </div>
                <img className={styles[this.state.anim]} src={`./../image/${this.state.icon}.svg`} />
            </section>
        )
    }
}
