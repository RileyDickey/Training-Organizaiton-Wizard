import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Formik, Form, Field, withFormik } from 'formik';
import debug from 'sabio-debug';
import trainingFormSchema from '../../schemas/trainingFormSchema';
import { Card } from 'react-bootstrap';
import * as trainingOrgService from '../../services/trainingOrgService';
import PropTypes, { string } from 'prop-types';

const _logger = debug.extend('TrainingProviderForm');

function TrainingOrgSelection(props) {
    const [showNewTraining, setShowNewTraining] = useState(false);
    const [certificationTypes, setCertificationTypes] = useState([]);
    const [newTraining] = useState({ name: '' });

    const onGetCertTypesSuccess = (response) => {
        _logger('onGetCertTypesSuccess ', response.items);
        setCertificationTypes(response.items);
    };

    const onGetCertTypesError = (err) => {
        _logger('error getting certs', err);
    };

    useEffect(() => {
        const getCertTypes = (certArray) => {
            if (certArray.length === 0) {
                trainingOrgService.getCertificateTypes().then(onGetCertTypesSuccess).catch(onGetCertTypesError);
            }
        };
        getCertTypes(certificationTypes);
    }, []);

    const addNewType = () => {};

    const certificateTypesMapper = (cert) => {
        return (
            <li className="form-check btn-toolbar" key={cert.id}>
                <input
                    className="form-check-input me-2"
                    type="checkbox"
                    name="flexRadioDefault"
                    onClick={(e) => {
                        if (e.target.checked) {
                            props.setSelectedOrgCerts((prevState) => {
                                let newState = { ...prevState };
                                newState[cert.id] = cert;
                                return newState;
                            });
                        } else {
                            props.setSelectedOrgCerts((prevState) => {
                                let newState = { ...prevState };
                                delete newState[cert.id];
                                return newState;
                            });
                        }
                    }}
                />
                <label className="form-check-label mb-1" htmlFor="flexRadioDefault1">
                    {cert.name}
                </label>
            </li>
        );
    };

    const newTrainingField = (
        <Formik enableReinitialize={true} initialValues={newTraining} validationSchema={trainingFormSchema}>
            <div className="mt-3 row col-auto">
                <Field
                    label={'Other'}
                    type="text"
                    name="name"
                    placeholder="Enter Certificate Title"
                    className="form-control col"
                />
                <button type="button" onClick={addNewType} className="btn btn-primary btn-sm col-auto">
                    Small button
                </button>
            </div>
        </Formik>
    );

    const newCertListItem = (
        <li className="form-check btn-toolbar">
            <input
                className="form-check-input me-2"
                type="checkbox"
                name="flexRadioDefault"
                onClick={(e) => {
                    setShowNewTraining(e.target.checked);
                }}
            />
            <label className="form-check-label" htmlFor="flexRadioDefault1">
                Add a New Certificate
            </label>
        </li>
    );

    const selectedTrainerCard = (trainingOrg) => {
        if (trainingOrg.id) {
            return (
                <div className="col">
                    <Card className="d-block text-center">
                        <Card.Img className="w-50" src={trainingOrg.logo} />
                        <Card.Body>
                            <Card.Title as="h4">{trainingOrg.name}</Card.Title>
                            <Card.Text>Description: {trainingOrg.description}</Card.Text>
                            <Card.Text>Business Phone: {trainingOrg.businessPhone}</Card.Text>
                        </Card.Body>

                        <Card.Body>
                            <Card.Link href={trainingOrg.siteUrl}>Visit Company Site</Card.Link>
                            <Card.Link href="#">Another link</Card.Link>
                        </Card.Body>
                    </Card>
                </div>
            );
        }
    };

    const displaySelectedTrainer = selectedTrainerCard(props.userOrg);

    return (
        <React.Fragment>
            <div className="trainingwiz-container row">
                <Form className="card col-sm-6 text-center">
                    <h4>{props.userOrg.name}</h4>
                    <div></div>

                    <div className="mt-2 text-center">
                        <h4>Select Your Training:</h4>
                        <ul>
                            {certificationTypes.map(certificateTypesMapper)}
                            {newCertListItem}
                        </ul>
                        {showNewTraining ? newTrainingField : null}
                    </div>
                    <Button variant="primary" type="submit" className="col-2">
                        {'Next'}
                    </Button>
                </Form>
                <div className="col">{props.userOrg !== null ? displaySelectedTrainer : 'Select a Company'}</div>
            </div>
        </React.Fragment>
    );
}

TrainingOrgSelection.propTypes = {
    values: PropTypes.shape({
        userOrg: PropTypes.shape({
            businessPhone: PropTypes.string,
            description: PropTypes.string,
            logo: PropTypes.string,
            name: PropTypes.string,
            siteUrl: PropTypes.string,
        }).isRequired,
        currentUser: PropTypes.shape({
            email: PropTypes.string.isRequired,
            id: PropTypes.number.isRequired,
            isLoggedIn: PropTypes.bool.isRequired,
            roles: PropTypes.arrayOf(string).isRequired,
        }),
    }),

    selectedOrgCerts: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
    }).isRequired,
    setSelectedOrgCerts: PropTypes.func,
    userOrg: PropTypes.shape({
        name: PropTypes.string,
    }).isRequired,
};

export default withFormik({
    handleSubmit: (values, { props }) => {
        props.onNext(values);
    },
})(TrainingOrgSelection);
