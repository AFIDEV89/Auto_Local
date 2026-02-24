import React from "react";
import { Helmet } from "react-helmet";
import { Container } from "reactstrap";

const Career = () => {
    return (
        <Container className="careerWrapper">
            <Helmet>
                <title>Discover exciting career opportunities at Autoform India.</title>
                <meta name='description' content="Join our team and be part of an innovative automotive industry leader." />
            </Helmet>
            <h1 className="title">WORK WITH US</h1>
            <p>Join our team to help shape the future of entertainment for passionate fan communities.</p>
            <p>E-Mail us your CV at: <span className="email">careers@autoformindia.com</span></p>
        </Container>
    )
}

export default Career;