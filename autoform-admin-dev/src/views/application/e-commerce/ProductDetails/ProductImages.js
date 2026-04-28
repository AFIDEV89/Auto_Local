import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import { useTheme } from '@mui/material/styles';
import { Box, CardMedia, Grid, useMediaQuery } from '@mui/material';

import MainCard from 'ui-component/cards/MainCard';
import Avatar from 'ui-component/extended/Avatar';
import { getProductPicture, getProductPictures, gridSpacing } from 'store/constant';

import Slider from 'react-slick';
import Carousel, { Modal, ModalGateway } from 'react-images';

import useConfig from 'hooks/useConfig';

const SLIDER_SETTINGS = {
    dots: false,
    centerMode: true,
    swipeToSlide: true,
    focusOnSelect: true,
    centerPadding: '0px'
};

const ProductImages = ({
    productInfo = {}
}) => {
    const [selected, setSelected] = useState(null);
    const [modal, setModal] = useState(false);
    const [mediaArr, setMediaArr] = useState([]);
    const [isVideoSelected, setIsVideoSelected] = useState(false);

    const theme = useTheme();
    const { borderRadius } = useConfig();

    const matchDownLG = useMediaQuery(theme.breakpoints.up('lg'));

    useEffect(() => {
        const initialImage = productInfo ? getProductPicture(productInfo) : null;

        setSelected(initialImage);
    }, [productInfo]);

    useEffect(() => {
        setMediaArr([
            ...(productInfo ? getProductPictures(productInfo) : []), // fetch images
            ...(productInfo?.videos ? productInfo?.videos.map((item) => { // fetch videos
                return {
                    src: item,
                    type: 'video'
                };
            }) : []) 
        ]);
    }, [productInfo]);

    return (
        <>
            <Grid container alignItems="center" justifyContent="center" spacing={gridSpacing}>
                <Grid item xs={12}>
                    <MainCard content={false} sx={{ m: '0 auto' }}>
                        {!isVideoSelected
                            ? <CardMedia
                                onClick={() => setModal(!modal)}
                                component="img"
                                image={selected}
                                sx={{ borderRadius: `${borderRadius}px`, overflow: 'hidden', cursor: 'zoom-in' }}
                            />
                            : <CardMedia
                                sx={{ borderRadius: `${borderRadius}px`, overflow: 'hidden', cursor: 'zoom-in' }}
                                component='video'
                                image={selected}
                                autoPlay
                            />
                        }
                    </MainCard>
                </Grid>
                
                <Grid item xs={11} sm={7} md={9} lg={10} xl={8}>
                    <Slider {...SLIDER_SETTINGS} slidesToShow={mediaArr.length >= 3 ? 3 : mediaArr}>
                        {mediaArr.map((item, index) => {
                            if (item.type === 'image') {
                                return (
                                    <Box
                                        key={index}
                                        onClick={() => {
                                            setIsVideoSelected(false);
                                            setSelected(item.src);
                                        }}
                                        sx={{ p: 1 }}
                                    >
                                        <Avatar
                                            outline={selected === item.src}
                                            size={matchDownLG ? 'lg' : 'md'}
                                            color="primary"
                                            src={item.src}
                                            variant="rounded"
                                            sx={{ m: '0 auto', cursor: 'pointer' }}
                                        />
                                    </Box>
                                );
                            } else if (item.type === 'video') {
                                return (
                                    <Box
                                        fontStyle={{ textAlign: 'center' }}
                                        key={index}
                                        onClick={() => {
                                            setSelected(item.src);
                                            setIsVideoSelected(true);
                                        }}
                                        sx={{ p: 1 }}
                                    >
                                        <video height={60} width={60} src={item.src}></video>
                                    </Box>
                                );
                            }
                            return false;
                        })}
                    </Slider>
                </Grid>
            </Grid>

            {!!(mediaArr.length) &&
                <ModalGateway>
                    {modal ? (
                        <Modal onClose={() => setModal(!modal)}>
                            <Carousel views={mediaArr.map(media => {
                                return { source: media.src };
                            })} />
                        </Modal>
                    ) : null}
                </ModalGateway>
            }
        </>
    );
};

ProductImages.propTypes = {
    productInfo: PropTypes.object
};

export default ProductImages;
