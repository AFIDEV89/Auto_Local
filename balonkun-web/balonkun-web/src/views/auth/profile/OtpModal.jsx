import React, { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogContent, DialogTitle, Typography } from "@mui/material"
import OtpInput from 'react-otp-input';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "./firebase";
import { errorAlert, successAlert } from '@utils';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useMediaQuery } from "@mui/material";

auth.useDeviceLanguage();

const OtpModal = ({
    isOpen,
    onClose,
    phone,
    setUserDetail,
    onHandleUpdate
}) => {
    const isMobile = useMediaQuery('(max-width:767px)');
    const [otp, setOtp] = useState('');
    const [enableGenerateBtn, setEnableGenerateBtn] = useState(true)
    const [isOtpGenerated, setIsOtpGenerated] = useState(false)

    const phoneWithCountryCode = "+91" + phone

    const generateOTP = () => {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'invisible-recaptcha-box', {
            size: 'invisible',
            callback: (response) => {
                setEnableGenerateBtn(false)
            }
        });

        signInWithPhoneNumber(auth, phoneWithCountryCode, window.recaptchaVerifier)
            .then((confirmationResult) => {
                // SMS sent. Prompt user to type the code from the message, then sign the
                window.confirmationResult = confirmationResult;
                setIsOtpGenerated(true)
                successAlert("OTP sent successfully.");
            })
            .catch((error) => {
                setEnableGenerateBtn(true)
                setIsOtpGenerated(false)

                if (window?.recaptchaVerifier) {
                    window.recaptchaVerifier?.render()?.then(function (widgetId) {
                        window.grecaptcha.reset(widgetId);
                    });
                }

                errorAlert(error.message)
            })
    }

    useEffect(() => {
        return () => {
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier?.clear()
                delete window.recaptchaVerifier;
            }
        }
    }, [])

    const verifyOTP = () => {
        const confirmationResult = window.confirmationResult;

        confirmationResult.confirm(otp).then((result) => {
            setUserDetail(prev => {
                const state = {
                    ...prev, 
                    is_phone_verified: true
                }

                onHandleUpdate?.(state);

                return state
            });

            successAlert("Phone Number verified successfully");

            // Close the modal
            onClose();
        })
        .catch((error) => {
            errorAlert(error.message)
        })
        .finally(() => {
            
        })
    }

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth>
            <DialogTitle sx={{ m: 0, p: 2 }}>
                <div id="invisible-recaptcha-box"></div>
                <Typography variant='body1' fontWeight="500">OTP Verification</Typography>
            </DialogTitle>
            <FontAwesomeIcon icon={faClose} onClick={onClose} style={{
				 position: 'absolute',
				 right: 8,
				 top: 8,
				 padding: 8,
				 fontSize: 18,
				 color: "rgb(158, 158, 158)",
				 cursor: "pointer"
			}} />
            <DialogContent dividers sx={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}>
                <Typography>We have sent an OTP via SMS on</Typography>
                <Typography mb={2}>{phone}</Typography>

                <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    inputType="number"
                    inputStyle={{
                        width: isMobile ? "30px" : "50px",
                        height: isMobile ? "30px" : "50px",
                        pointerEvents: !isOtpGenerated ? "none" : "auto"
                    }}
                    renderSeparator={<span>-</span>}
                    renderInput={(props) => <input {...props} />}
                />

                <Box mt={4}>
                    <Button
                        variant="contained"
                        size="small"
                        disabled={!enableGenerateBtn}
                        sx={{
                            marginRight: 2
                        }}
                        onClick={generateOTP}>
                        Send OTP
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        disabled={otp.length < 6 || !isOtpGenerated}
                        sx={{
                            marginRight: 2
                        }}
                        onClick={verifyOTP}>
                        Verify OTP
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default OtpModal