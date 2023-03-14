import { createTheme, TextField, ThemeProvider } from "@mui/material";
import React, { useEffect, useState } from "react";
import './styles.css'

export const InputSearchSale = (props: any) => {
    const [sale, setSale] = useState(props.sale)
    const [value, setValue] = useState(props.value)

    const theme = createTheme({
        palette: {
            primary: {
                main: document.querySelector('.main')?.classList.contains('darkThemed') ? "#c2c2c2" : "#3e8ed0",
            },
            text: {
                primary: document.querySelector('.main')?.classList.contains('darkThemed') ? "#FFF" : "#000"
            },
            action: {
                active: document.querySelector('.main')?.classList.contains('darkThemed') ? "#3e8ed0" : "#3e8ed0",
            }
        }
    });

    useEffect(() => {
        setSale(props.sale)
        setValue(props.value)
    }, [props.value])


    return (
        <ThemeProvider theme={theme}>
            <TextField
                id={`outlined-basic${props.string == true ? '-string' : ""}`}
                label={props.label}
                variant="outlined"
                size="small"
                autoComplete='off'
                disabled={Array.isArray(sale) || sale.numSale ? true : false}
                onChange={!props.string ? (e: any) => props.set(isNaN(e.target.value) ? 0 : e.target.value) : (e: any) => props.set(e.target.value)}
                value={value < 1 ? '' : value}
                style={{ 'width': '105px', "color": "#FFF !important" }}
                className={`mr-2 ${props.marginBot == true ? "mb-5" : ""}`}
                focused={document.querySelector('.main')?.classList.contains('darkThemed') ? true : undefined}
                autoFocus={props.autoFocus ? true : undefined}
            />
        </ThemeProvider>
    )
}