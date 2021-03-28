import React from 'react';
import styles from './../../styles/Modal.module.css';
const log = console.log;
export default class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            style: 'modalClose'
        }
        this.ModalControl = this.ModalControl.bind(this);

    }
    componentDidUpdate(prevProps){
        let modalOn = this.state.modalOn;
        if(this.props.modalOn !== prevProps.modalOn){
            this.ModalControl(this.props.modalOn);
        }
    }
    ModalControl(modal) {
        if (modal) {
            const scrollY = `${window.scrollY}px`;
            const body = document.body;
            body.style.position = 'fixed';
            body.style.top = `-${scrollY}`;
            this.setState({ style: 'modalOpen' })
        }
        else {
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
            this.setState({ style: 'modalClose' })
        }

    }
    render() {
        return (
            <div>
                <section className={styles[this.state.style]} style={{ backdropFilter: `blur(${this.props.blur ? this.props.blur : 2}px)`, background: this.props.bgColor ? this.props.bgColor : 'rgba(0, 0, 0, 0.557)' }}>
                    {this.props.children}
                </section>
            </div>
        )
    }
}