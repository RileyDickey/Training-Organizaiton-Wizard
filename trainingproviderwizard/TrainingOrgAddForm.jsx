import React from 'react';
import { withFormik } from 'formik';
import PropTypes from 'prop-types';
import { subcontractorInfoSchema } from '../../schemas/subcontractorSchemas';
import toastr from 'toastr';
import debug from 'debug';
import { Card, ListGroup, Button } from 'react-bootstrap';
import * as trainingOrgService from '../../services/trainingOrgService';
const _logger = debug.extend('TrainingProviderForm');

const TrainingOrgAddForm = (props) => {
    const certMapToArray = (position) => {
        let certArray = [];
        for (const key in position) {
            if (Object.hasOwnProperty.call(position, key)) {
                const cert = position[key];
                certArray.push(cert.name);
            }
        }
        return certArray;
    };

    const certArray = certMapToArray(props.selectedOrgCerts);

    const certMapper = (cert, index) => {
        return (
            <div key={index}>
                <ul className="list-group-item border">{cert}</ul>
            </div>
        );
    };

    const postCertSuccess = (response) => {
        _logger('Post Cert Successful', response);
        toastr.success('Training Added Successfully');
    };

    const postCertError = (err) => {
        _logger(err, 'Failed to Post Cert');
        toastr.error('Failed to Add Training');
    };

    const sendCerts = (data, listCerts) => {
        let info = {};
        info.OrganizationId = data.userOrg.id;
        info.BatchOrgCerts = listCerts;
        trainingOrgService.addOrgCert(info).then(postCertSuccess).catch(postCertError);
    };

    return (
        <React.Fragment>
            <div className="row">
                <div className="col">
                    <Card className="d-block text-center">
                        <Card.Body>
                            <Card.Title as="h2">{props.userOrg.name}</Card.Title>
                            <Card.Text>Description: {props.userOrg.description}</Card.Text>
                            <Card.Text>Business Phone: {props.userOrg.businessPhone}</Card.Text>
                        </Card.Body>

                        <ListGroup variant="flush">
                            <ListGroup.Item>Cras justo odio</ListGroup.Item>
                        </ListGroup>

                        <Card.Body>
                            <Card.Link href={props.userOrg.siteUrl}>Visit Company Site</Card.Link>
                            <Card.Link href="#">Another link</Card.Link>
                        </Card.Body>
                    </Card>
                </div>
                <div className="col">
                    <Card className="d-block text-center">
                        <Card.Body className="d-block text-center">
                            <Card.Title as="h2">Confirm Selection</Card.Title>
                            <ul className="list-group list-group">{certArray.map(certMapper)}</ul>
                        </Card.Body>
                    </Card>
                </div>
            </div>
            <Button
                variant="primary"
                type="button"
                className="col-sm-1"
                onClick={() => {
                    sendCerts(props, certArray);
                }}>
                {'Submit'}
            </Button>
        </React.Fragment>
    );
};

TrainingOrgAddForm.propTypes = {
    userOrg: PropTypes.shape({
        businessPhone: PropTypes.string,
        description: PropTypes.string,
        logo: PropTypes.string,
        name: PropTypes.string,
        siteUrl: PropTypes.string,
    }),
    selectedOrgCerts: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
    }),
    isSubmitting: PropTypes.bool,
    onChange: PropTypes.func,
    handleBlur: PropTypes.func,
    handleSubmit: PropTypes.func,
    handleChange: PropTypes.func,
    backLabel: PropTypes.string,
    nextLabel: PropTypes.string,
    onBack: PropTypes.func,
    onNext: PropTypes.func,
};

export default withFormik({
    handleSubmit: (values, { props }) => {
        props.onNext(values);
    },

    validationSchema: subcontractorInfoSchema,
})(TrainingOrgAddForm);
