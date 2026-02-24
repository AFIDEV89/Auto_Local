import React from "react";
import { Col, Container, Row } from "reactstrap";
import { img1, img2, img3, img4, img5, img6, img7, img8, img9 } from "@assets/images";

const SocialUpdatesDesktop = ({
    title
}) => {
    return (
        <section>
            <h2 className="heading">
                {title}
            </h2>

            <Container fluid className="social-updates-wrapper">
                <Row style={{ paddingBottom: "50px", justifyContent: "center" }}>
                    <Row style={{ margin: "0px", padding: "0px", width: "400px" }}>

                        <Col className="overlay-screen" style={{ padding: "0px", height: "400px" }} sm={12}>
                            <a href="https://www.instagram.com/reel/C2aj5lRhYLZ/?igsh=b2F3c2gyY25reWZ0" target="_blank" rel="noreferrer">
                                <img style={{ height: "400px", width: "400px" }} src={img1} alt="how it works" />
                            </a>
                        </Col>

                        <Col className="overlay-screen" style={{ padding: "0px" }} sm={6}>
                            <a href="https://www.instagram.com/reel/C4iSJJUB8lE/?igsh=MXFyZDdxdm5hMmZuZg==" target="_blank" rel="noreferrer">
                                <img style={{ height: "200px", width: "200px" }} src={img2} alt="how it works" />
                            </a>
                        </Col>

                        <Col className="overlay-screen" style={{ padding: "0px" }} sm={6}>
                            <a href="https://www.instagram.com/reel/C7lTVtANev-/?igsh=cGY0czg3d29udXk3" target="_blank" rel="noreferrer">
                                <img style={{ height: "200px", width: "200px" }} src={img3} alt="how it works" />
                            </a>
                        </Col>
                    </Row>

                    <Row style={{ margin: "0px", padding: "0px", width: "400px" }}>
                        <Col className="overlay-screen" style={{ padding: "0px", height: "200px" }} sm={6}>
                            <a href="https://www.instagram.com/reel/C4P0D25rmbn/?igsh=bjFocWpwNjlrNzA1" target="_blank" rel="noreferrer">
                                <img style={{ height: "200px", width: "200px" }} src={img4} alt="how it works" />
                            </a>
                        </Col>

                        <Col className="overlay-screen" style={{ padding: "0px", height: "200px" }} sm={6}>
                            <a href="https://www.instagram.com/reel/C2XF091L-M3/?igsh=MnhpdWdtbTBkcmUx" target="_blank" rel="noreferrer">
                                <img style={{ height: "200px", width: "200px" }} src={img5} alt="how it works" />
                            </a>
                        </Col>

                        <Col className="overlay-screen" style={{ padding: "0px" }} sm={12}>
                            <a href="https://www.instagram.com/reel/C3DDo6DBftO/?igsh=d3o1dDkwbTJ4N3Fz" target="_blank" rel="noreferrer">
                                <img style={{ height: "400px", width: "400px" }} src={img6} alt="how it works" />
                            </a>
                        </Col>
                    </Row>

                    <Row style={{ margin: "0px", padding: "0px", width: "400px" }}>
                        <Col className="overlay-screen" style={{ padding: "0px", height: "400px" }} sm={12}>
                            <a href="https://www.instagram.com/reel/C6x_XLSNRBM/?igsh=dGQ1dnVjMnE3ajM4" target="_blank" rel="noreferrer">
                                <img style={{ height: "400px", width: "400px" }} src={img7} alt="how it works" />
                            </a>
                        </Col>

                        <Col className="overlay-screen" style={{ padding: "0px" }} sm={6}>
                            <a href="https://www.instagram.com/reel/C5N_zyQhmtD/?igsh=MWNraHR3eG5weGx6bg==" target="_blank" rel="noreferrer">
                                <img style={{ height: "200px", width: "200px" }} src={img8} alt="how it works" /></a>
                        </Col>

                        <Col className="overlay-screen" style={{ padding: "0px" }} sm={6}>
                            <a href="https://www.instagram.com/reel/C8CeEThBso4/?igsh=MTFrNmZzdW1yeXJ0aw==" target="_blank" rel="noreferrer">
                                <img style={{ height: "200px", width: "200px" }} src={img9} alt="how it works" />
                            </a>
                        </Col>
                    </Row>

                </Row>
            </Container>
        </section>
    );
}

export default SocialUpdatesDesktop;