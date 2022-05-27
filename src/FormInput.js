import './FormInput.css';

const FormInput = (props) => {
    return (
        <div className="formInput">
            {/* <input placeholder={props.placeholder} onChange={e => props.setToken(e.target.value)}></input> */}
            <input ref={props.refer} placeholder={props.placeholder}></input>
        </div>
    );
}

export default FormInput;