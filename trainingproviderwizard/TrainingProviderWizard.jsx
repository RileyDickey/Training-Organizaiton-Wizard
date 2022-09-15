import React, { useState } from 'react';
import { useEffect } from 'react';
import PropTypes, { string } from 'prop-types';
import Debug from 'debug';
import Loki from 'react-loki';
import './trainingproviderwizard.css';
import '../subcontractorwizard/subcontractorwizard.css';
import TrainingProviderIntro from './TrainingProviderIntro';
import Card from 'react-bootstrap/Card';
import { FaPlay, FaPeopleArrows, FaList } from 'react-icons/fa';
import TrainingOrgAddForm from './TrainingOrgAddForm';
import TrainingOrgSelection from './TrainingOrgSelection';
import organizationService from '../../services/organizationService';

const _logger = Debug.extend('TrainingProviderWizard');

const TrainingProviderWizard = (props) => {
    const [trainingOrg, setTrainingOrg] = useState([]);
    const [selectedOrgCerts, setSelectedOrgCerts] = useState({});

    const getUserOrgsSuccess = (response) => {
        _logger('GET User Orgs Success', response);
        setTrainingOrg(response.item);
    };

    useEffect(() => {
        const getUsersOrg = (userOrg) => {
            if (userOrg.length === 0) {
                organizationService.getOrganizationByUserId(props.xx.xx).then(getUserOrgsSuccess);
            }
        };
        getUsersOrg(trainingOrg);
    }, []);

    const mergeValues = (values) => {
        setTrainingOrg((prevState) => {
            const subcontractorData = { ...prevState, ...values };
            return subcontractorData;
        });
    };

    const _onFinish = (values) => {
        setTrainingOrg((prevState) => {
            const subcontractorData = { ...prevState, ...values };

            return subcontractorData;
        });
    };

    const trainingOrgWizardSteps = [
        {
            label: 'Step 0',
            icon: <FaPlay className="mt-3" />,
            component: <TrainingProviderIntro data={trainingOrg} onChange={mergeValues} />,
        },
        {
            label: 'Step 1',
            icon: <FaPeopleArrows className="mt-3" />,
            component: (
                <TrainingOrgSelection
                    currentUser={props.currentUser}
                    userOrg={trainingOrg}
                    data={trainingOrg}
                    onChange={mergeValues}
                    selectedOrgCerts={selectedOrgCerts}
                    setSelectedOrgCerts={setSelectedOrgCerts}
                />
            ),
        },
        {
            label: 'Step 2',
            icon: <FaList className="mt-3" />,
            component: (
                <TrainingOrgAddForm
                    currentUser={props.currentUser}
                    selectedOrgCerts={selectedOrgCerts}
                    setSelectedOrgCerts={setSelectedOrgCerts}
                    userOrg={trainingOrg}
                    data={trainingOrg}
                    onChange={mergeValues}
                />
            ),
        },
    ];

    return (
        <React.Fragment>
            <div className="row"></div>
            <Card className="trainer-card-container">
                <div className="training-wizard-container">
                    <h1 className="trainer-welcome">Add Training Offerings</h1>
                    <section id="content">
                        <div className="trainerDemo">
                            <Loki
                                steps={trainingOrgWizardSteps}
                                onChange={mergeValues}
                                onFinish={_onFinish}
                                onNext={mergeValues}
                                onBack={mergeValues}
                                noActions
                            />
                        </div>
                    </section>
                </div>
            </Card>
        </React.Fragment>
    );
};
TrainingProviderWizard.propTypes = {
    currentUser: PropTypes.shape({
        email: PropTypes.string,
        id: PropTypes.number,
        isLoggedIn: PropTypes.bool,
        roles: PropTypes.arrayOf(string),
    }).isRequired,
    trainingOrg: PropTypes.shape({
        businessPhone: PropTypes.string,
        description: PropTypes.string,
        logo: PropTypes.string,
        name: PropTypes.string,
        siteUrl: PropTypes.string,
    }).isRequired,
};

export default TrainingProviderWizard;
