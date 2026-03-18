import React from "react";
import { Container } from "reactstrap";
import "./404.scss"
import { maintenance } from '@assets/images';
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <Container className="notFoundBox">
            <Helmet>
                <title>404 Page Not Found | Autoform India</title>
                <meta name="robots" content="noindex" />
            </Helmet>
            <img src={maintenance} alt="404 page not found" />

            <h1 className="title">Oops!</h1>
            <h1 className="title2">Page not found</h1>

            <div className="helperTextBox">
                <p>The page you are looking for doesn't exist or an other error occurred, go back to home page</p>

                <button className="goBack" onClick={() => navigate("/")} >Go Back</button>
            </div>
        </Container>
    )
}

export default NotFoundPage