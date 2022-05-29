import './FormInput.css';

const FormInput = (props) => {
    return (
        <div className="formInput">
            {/* <input placeholder={props.placeholder} onChange={e => props.setToken(e.target.value)}></input> */}
            {/* { props.disabled ? <input ref={props.refer} type="text" placeholder={props.placeholder} onChange={e => console.log(e.target.value)} disabled></input> : <input ref={props.refer} placeholder={props.placeholder} /> } */}
            { props.disabled ? <input ref={props.refer} type="text" placeholder={props.placeholder} onChange={e => console.log(e.target.value)} disabled></input> : <input ref={props.refer} placeholder={props.placeholder} /> }
        </div>
    );
}

export default FormInput;