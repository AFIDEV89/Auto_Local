import React from "react";
import { Container } from "reactstrap";
import "./maintenance.scss"
import { maintenance } from '@assets/images';

const MaintenancePage = () => {
    return (
        <Container className="maintenanceBox">
            <img src={maintenance} alt="maintenance mode" />

            <h1 className="title">Website under maintenance...</h1>

            <div className="helperTextBox">
                <p>Our website is currently undergoing scheduled maintenance.</p>
                <p>We should be back shortly. Thanks for your patience.</p>
            </div>
        </Container>
    )
}

export default MaintenancePage