import styles from './../styles/ButtonClose.module.css';
export default function ButtonClose(props) {

    return (
        <button type='button' onClick={props.Click} className={styles.modalCloseButton}>
            <img src='./image/close.svg' />
        </button>
    )
}