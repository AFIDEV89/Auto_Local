import React, { useEffect, useState } from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Autocomplete, Dialog, DialogContent, TextField, debounce } from "@mui/material";
import { getDataApi } from "@services/ApiCaller";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@shared/constants";

const loadData = async (inputValue, setOptions) => {
    const results = await getDataApi({ path: `search?q=${inputValue}` })

    if (results?.data?.data?.list) {
        setOptions(results.data.data.list)
    }
    else {
        setOptions([])
    }
}

const debouncedLoadData = debounce(loadData, 1000);

const SearchDialog = ({
    handleClose,
    open,
    setIsSearchDialogOpen
}) => {
    const navigate = useNavigate()
    const [inputValue, setInputValue] = useState('')
    const [options, setOptions] = useState([])

    const handleInputChange = (event, newInputValue) => {
        setInputValue(newInputValue);
        debouncedLoadData(newInputValue, setOptions);
    };

    useEffect(() => {
        if(!open) {
            setInputValue("")
            setOptions([])
        }
    }, [open])

    const handleClick = (pid, seo_canonical) => {
        navigate(seo_canonical ? `${ROUTES.PRODUCT}/${seo_canonical}` : `${ROUTES.PRODUCT}/${pid}`);
        setIsSearchDialogOpen(false)
    }

    return (
        <Dialog fullScreen onClose={handleClose} open={open} className="searchDialog">
            <DialogContent>
                <FontAwesomeIcon icon={faXmark} onClick={handleClose} className="searchDialogCross" />
                <Autocomplete
                    disablePortal
                    freeSolo
                    id="combo-box-demo"
                    filterOptions={(x) => x}
                    options={options}
                    inputValue={inputValue}
                    getOptionLabel={(option) => option.name}
                    onInputChange={handleInputChange}
                    renderOption={(props, option) => {
                        return (
                            <div key={option.id} className="search-result-item" onClick={() => handleClick(option.id, option.seo_canonical)}>
                                <div className="image-wrapper">
                                    {option.pictures && option.pictures.length > 0 && <img src={option.pictures[0]} alt="" width={50} />}
                                </div>
                                <div className="content">
                                    <p className="product">{option.category.name} {'>'} {option.name}</p>
                                    <p className="price">Price: <span>₹ {option.original_price}</span></p>
                                </div>
                            </div>
                        )
                    }}
                    sx={{ width: 500, backgroundColor: "#fff" }}
                    renderInput={(params) => <TextField {...params} label="Search by Title, Brand, Category ..." variant="filled" />}
                />
            </DialogContent>
        </Dialog>
    )
}

export default SearchDialog;