import React from 'react';
import { Container, Row, Col, Card } from 'reactstrap';
import { account, saving, support1 } from '@assets/images';

const Support = () => {
	return (
		<>
			<Container fluid className="advantages">
				<Container>
					<Row>
						<Col lg={4}>
							<Card>
								<img src={support1} className="img-fluid" alt="" />
								<h4>Product Support</h4>
								<p>
									Up to 3 years on-site warranty available for your peace of
									mind.
								</p>
							</Card>
						</Col>
						<Col lg={4}>
							<Card>
								<img src={account} className="img-fluid" alt="" />
								<h4>Personal Account</h4>
								<p>
									With big discounts, free delivery and a dedicated support
									specialist.
								</p>
							</Card>
						</Col>
						<Col lg={4}>
							<Card>
								<img src={saving} className="img-fluid" alt="" />
								<h4>Amazing Savings</h4>
								<p>
									Up to 70% off new Products, you can be sure of the best price.
								</p>
							</Card>
						</Col>
					</Row>
				</Container>
			</Container>
		</>
	);
};

export default Support;
