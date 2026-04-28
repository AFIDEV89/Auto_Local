import React, { useEffect, useState } from 'react';
// Triggering fresh deployment with corrected footer logo
import { useDispatch } from 'react-redux';
import { Container, Col, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import {
	faFacebookF,
	faInstagram,
	faTwitter,
	faWhatsapp,
	faYoutube
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MODULES } from '@shared/constants';
import * as actions from '@redux/actions';
import CollapsibleSeoFooterLinks from './CollapsibleSeoFooterLinks';
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useMediaQuery } from "@mui/material";

const FOOTER_LOGO_URL = "https://autoform-image.s3.ap-south-1.amazonaws.com/Autoform-_-New-Logo+(3).png";

const Footer = () => {
	const dispatch = useDispatch();
	const [footerSeo, setFooterSeo] = useState();
	const [isCollapsedPolicy, setIsCollapsedPolicy] = useState(false);
	const [isCollapsedInfo, setIsCollapsedInfo] = useState(false);
	const [isCollapsedFollow, setIsCollapsedFollow] = useState(false);
	const isMobile = useMediaQuery('(max-width:767px)');

	useEffect(() => {
		dispatch(actions.getFooterSEOData({}, (res) => {
			setFooterSeo(res);
		}))
	}, [dispatch])

	const collapsePolicy = () => {
		setIsCollapsedPolicy(prev => !prev)
	}

	const collapseInfo = () => {
		setIsCollapsedInfo(prev => !prev)
	}

	const collapseFollow = () => {
		setIsCollapsedFollow(prev => !prev)
	}

	return (
		<footer className="footer">
			<Container>
				<Row>
					<Col lg={6}>
						<div className="mb-4 mt-[-8px]">
							<img 
								src={FOOTER_LOGO_URL} 
								alt="AutoForm" 
								style={{ height: '60px', objectFit: 'contain' }} 
							/>
						</div>
						<p className="footer-desc">
							An ISO TS/ 16949 certified company, Autoform is a Leading Provider of
							Premium Quality Car Seat Covers in India. With our Experience of over 30 Years in the Industry,
							the company is highly skilled and is equipped with the best of facilities to match all High
							Quality Production Standards. Our Plant at Dehradun, Uttrakhand is spread over an area of
							2,20,000 Sq. Feet and boasts of State of the Art Machinery such as the German CNC Auto Cutter
							and Japanese Automatic Stitching Machines.
						</p>
					</Col>
					<Col lg={2} sm={4} className='footer-heading-wrapper'>
						<h4 className="footer-heading" onClick={isMobile ? collapsePolicy : undefined}>
							Policy {isMobile && <FontAwesomeIcon icon={isMobile && isCollapsedPolicy ? faMinus : faPlus} color="#f9ec7d" fontSize={12} />}
						</h4>
						{(!isMobile || isCollapsedPolicy) && (
							<ul>
								{MODULES.FOOTER.LINKS.map(link => (
									<li key={link.title}>
										<Link to={link.route}>
											{link.title}
										</Link>
									</li>
								))}
							</ul>
						)}
					</Col>
					<Col lg={2} sm={4} className='footer-heading-wrapper'>
						<h4 className="footer-heading" onClick={isMobile ? collapseInfo : undefined}>
							Information {isMobile && <FontAwesomeIcon icon={isMobile && isCollapsedInfo ? faMinus : faPlus} color="#f9ec7d" fontSize={12} />}
						</h4>
						{(!isMobile || isCollapsedInfo) && (
							<ul>
								<li>
									<a href="https://warranty2.autoformindia.co.in/login?mode=warranty" target="_blank" rel="noreferrer">
										Warranty
									</a>
								</li>
								<li>
									<Link to="/retail-franchise">Retail Franchise</Link>
								</li>
								<li>
									<a href="https://warranty2.autoformindia.co.in/login?mode=franchise" target="_blank" rel="noreferrer">
										Retail Franchise - Portal
									</a>
								</li>
								<li>
									<Link to="/careers">Careers</Link>
								</li>
								<li>
									<Link to="/contact-us">Contact Us</Link>
								</li>
								<li>
									<Link to="/blogs">Blogs</Link>
								</li>
							</ul>)}
					</Col>
					<Col lg={2} sm={4} className='footer-heading-wrapper'>
						<h4 className="footer-heading" onClick={isMobile ? collapseFollow : undefined}>
							Follow Us {isMobile && <FontAwesomeIcon icon={isMobile && isCollapsedFollow ? faMinus : faPlus} color="#f9ec7d" fontSize={12} />}
						</h4>
						{(!isMobile || isCollapsedFollow) && (
							<ul>
								<li className='sm-list'>
									<a
										target="_blank"
										rel="noreferrer"
										href="https://www.facebook.com/AutoformIndia/"
									>
										<FontAwesomeIcon icon={faFacebookF} />Facebook
									</a>
								</li>
								<li className='sm-list'>
									<a
										target="_blank"
										rel="noreferrer"
										href="https://twitter.com/autoformindia"
									>
										<FontAwesomeIcon icon={faTwitter} />Twitter
									</a>
								</li>
								<li className='sm-list'>
									<a
										target="_blank"
										rel="noreferrer"
										href="https://www.instagram.com/autoformindia/"
									>
										<FontAwesomeIcon icon={faInstagram} />Instagram
									</a>
								</li>
								<li className='sm-list'>
									<a
										target="_blank"
										rel="noreferrer"
										href="https://www.youtube.com/autoformindia"
									>
										<FontAwesomeIcon icon={faYoutube} />YouTube
									</a>
								</li>
								<li className='sm-list'>
									<a
										target="_blank"
										rel="noreferrer"
										href="https://wa.me/7217014601"
									>
										<FontAwesomeIcon icon={faWhatsapp} />WhatsApp
									</a>
								</li>
							</ul>)}
					</Col>
				</Row>
				<Row>
					{
						footerSeo && Object.keys(footerSeo)
							.filter(key => ['Make and Model', 'Car Accessories', 'Car Floor Mats'].includes(key))
							.map(titleKey => {
								return (
									<CollapsibleSeoFooterLinks footerSeo={footerSeo} titleKey={titleKey} key={titleKey} />
								)
							})
					}
				</Row>
				<Row className="c-row">
					<p className="c-text">Copyright ©Autoform 2024.</p>
				</Row>
			</Container>
		</footer>
	);
};

export default Footer;
