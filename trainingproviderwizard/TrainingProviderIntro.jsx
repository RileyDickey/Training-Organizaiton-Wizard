import React from 'react';
import { withFormik } from 'formik';
import PropTypes from 'prop-types';

const TrainingProviderIntro = (props) => {
    const {
        isSubmitting,
        handleSubmit,

        nextLabel,
    } = props;

    return (
        <form onSubmit={handleSubmit} className="p-1">
            <div className="trainer-container row">
                <div className="col-sm">
                    <div>
                        <h4 className="trainer-welcome">Welcome!</h4>
                        <br></br>
                        <h4>This Wizard will guide you in setting up all of your Organizations Training Information</h4>
                    </div>
                    <button
                        style={{ margin: '3px' }}
                        type="submit"
                        className="btn btn-primary ml-1 col-2"
                        disabled={isSubmitting}>
                        {nextLabel}
                    </button>
                </div>

                <div className="trainingwiz-picture-container col-6">
                    <div className="">
                        <div className="trainer-intro-pictures col-4">
                            <img src="https://bit.ly/3zUNNUa" alt="trainer-intro"></img>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

TrainingProviderIntro.propTypes = {
    touched: PropTypes.shape({
        isActive: PropTypes.bool,
    }).isRequired,
    errors: PropTypes.shape({
        isActive: PropTypes.string,
    }).isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    nextLabel: PropTypes.string.isRequired,
    onNext: PropTypes.func.isRequired,
};

export default withFormik({
    handleSubmit: (values, { props }) => {
        props.onNext(values);
    },
})(TrainingProviderIntro);
