import PropTypes from 'prop-types';

import "./Form.css";

const Form = ({ open, fields, buttonText, onSubmit, onClose }) => {

    const closeForm = (e) => {
        if (e.target.classList.contains("formBg")) {
            onClose();
        }
    }

    const submit = (e) => {
        e.preventDefault();

        let data = {};

        fields.forEach(field => {
            data[field.name] = e.target.querySelector(`[name=${field.name}]`).value;
        });

        onSubmit(data);
    }
    
    return (
        <div className="formBg" style={{display: (open ? "block" : "none")}} onClick={closeForm}>
            <form className="form" onSubmit={submit}>
                {fields.map((field, i) => (
                    <input 
                        key={i}
                        type={field.type ?? "text"}
                        name={field.name}
                        defaultValue={field.defaultValue ?? ""}
                        placeholder={field.placeholder ?? ""}
                        minLength={field.minLength ?? ""}
                        maxLength={field.maxLength ?? ""}
                        autoComplete={field.autoComplete ?? ""}
                        disabled={field.disabled ?? ""}
                        required={field.required ?? ""}
                    />
                ))}
                <button>
                    {buttonText}
                </button>
            </form>
        </div>
    );
}

Form.defaultProps = {
    open: false,
    buttonText: "Submit",
}

Form.propTypes = {
    open: PropTypes.bool,
    fields: PropTypes.array.isRequired,
    buttonText: PropTypes.string,
}

export default Form;