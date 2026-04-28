import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import {
    Button
} from "@mui/material";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import API from "../../../../api/axios";
import { successAlert, errorAlert } from "../../../helpers";
import "./index.css";
import RichTextEditor from './RichTextEditor';
import ProductComments from './ProductComments';
import usePermission from 'hooks/usePermission';

export default function ProductTabs({ productInfo, getProductDetail }) {
    const [value, setValue] = React.useState('1');
    const [editDescp, setEditDescp] = React.useState(false);
    const [payloadData, setPaylaodData] = React.useState({});
    const { isUserModerator } = usePermission()

    const handleEditBtn = () => {
        setEditDescp(true);
        setPaylaodData({});
    };

    const onEditSave = async () => {
        setEditDescp(false);

        const response = await API.put(`/product/update/${productInfo.id}`, payloadData);

        if (productInfo.id && response.data.statusCode === 204) {
            setTimeout(() => {
                successAlert(`Product updated successfully.`);
                getProductDetail();
            }, 200);
        } else {
            errorAlert(response.data.message);
        }
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setEditDescp(false);
        setPaylaodData({});
    };

    const onChangeEditor = (name, value) => {
        setPaylaodData({ [name]: value });
    };

    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange}>
                        <Tab label="Description" value="1" />
                        <Tab label="Additional Info" value="2" />
                        <Tab label="Reviews" value="3" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <div className="descpDiv">
                        <div className="descriptionCk">
                            {editDescp &&
                                <RichTextEditor
                                    productInfo={productInfo?.description}
                                    name={'description'}
                                    onChangeEditor={onChangeEditor}
                                />
                            }
                            {!editDescp &&
                                <div
                                    dangerouslySetInnerHTML={{ __html: productInfo?.description }}
                                />
                            }
                        </div>
                        {!isUserModerator && <div className="editBtn">
                            {!editDescp &&
                                <Button
                                    type="submit"
                                    fullWidth
                                    color="secondary"
                                    variant="contained"
                                    size="large"
                                    onClick={handleEditBtn}
                                >
                                    Edit
                                </Button>
                            }
                            {editDescp && <Button
                                disabled={payloadData && Object.keys(payloadData).length === 0}
                                type="submit"
                                fullWidth
                                color="secondary"
                                variant="contained"
                                size="large"
                                onClick={onEditSave}
                            >
                                Save
                            </Button>
                            }

                        </div>}
                    </div>
                </TabPanel>
                <TabPanel value="2">
                    <div className="descpDiv">
                        <div className="descriptionCk">
                            {editDescp &&

                                <RichTextEditor
                                    productInfo={productInfo?.additional_info}
                                    name={'additional_info'}
                                    onChangeEditor={onChangeEditor}
                                />
                            }
                            {!editDescp &&

                                <div
                                    dangerouslySetInnerHTML={{ __html: productInfo?.additional_info }}
                                />

                            }
                        </div>
                       {!isUserModerator && <div className="editBtn">
                            {!editDescp &&
                                <Button
                                    type="submit"
                                    fullWidth
                                    color="secondary"
                                    variant="contained"
                                    size="large"
                                    onClick={handleEditBtn}
                                >
                                    Edit
                                </Button>
                            }
                            {editDescp && <Button
                                disabled={payloadData && Object.keys(payloadData).length === 0}
                                type="submit"
                                fullWidth
                                color="secondary"
                                variant="contained"
                                size="large"
                                onClick={onEditSave}
                            >
                                Save
                            </Button>
                            }
                        </div>}
                    </div>
                </TabPanel>
                <TabPanel value="3">
                    <ProductComments productId={productInfo.id} />
                </TabPanel>
            </TabContext>
        </Box>
    );
}
