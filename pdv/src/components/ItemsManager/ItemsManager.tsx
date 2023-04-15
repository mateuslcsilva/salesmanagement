import { Modal, Col, Spacer, Text, Row } from '@nextui-org/react'
import Tooltip from '@mui/material/Tooltip'
import './styles.css'
import Button from '../../components/Button/Button'
import React, { useEffect, useReducer, useState } from 'react'
import { OrdinaryInput } from '../OrdinaryInput/OrdinaryInput'
import { useAuthContext } from '../../utils/contexts/AuthProvider'
import { itemType } from '../../types/itemType/itemType'
import { Alert } from '@mui/material'
import { AlertModal } from '../AlertModal/AlertModal'
import { useItemListContext } from '../../utils/contexts/ItemsProvider'
import { useSalesContext } from '../../utils/contexts/SalesProvider'

export const ItemsManager = (props: any) => {

    const initialItemInfo = {} as itemType

    const AuthContext = useAuthContext()
    const ItemListContext = useItemListContext()
    const SalesContext = useSalesContext()
    const [alert, setAlert] = useState(<p></p>)
    const [alertVisible, setAlertVisible] = useState(false)
    const [itemInfo, setItemInfo] = useReducer(
        (currentValues: itemType, newValues: itemType): itemType => {
            return { ...currentValues, ...newValues }
        },
        initialItemInfo
    )

    const handleItemInfoChange = (event: {
        target: { name: string; value: string }
    }) => {
        const { name, value } = event.target
        const newValues = { [name]: value }
        setItemInfo({ ...itemInfo, ...newValues });
    };

    const alertHandle = () => setAlertVisible(true);
    const closeAlertHandle = () => setAlertVisible(false);

    const addItem = async () => {
        if (SalesContext.sales.length != 0) return alertHandle()
        const itemList = ItemListContext.itemList
        if (itemList.find(item => item.active && item.itemRef == itemInfo.itemRef)) return setAlert(<p className='error-label' ><i className="bi bi-x-octagon"></i>Referência já cadastrada!</p>)
        const convert = {
            active: true,
            itemRef: Number(itemInfo.itemRef),
            itemValue: typeof itemInfo.itemValue == "number" ? itemInfo.itemValue : Number(itemInfo.itemValue.replace(',', '.')),
            //@ts-ignore
            numItem: itemInfo.numItem ? itemInfo.numItem : itemList.map(item => item.numItem).sort((a, b) => a - b).at(-1) + 1
        }
        const newItem = [{ ...itemInfo, ...convert }]
        if (isNaN(newItem[0].numItem)) newItem[0].numItem = 1
        let newItemList: Array<itemType> = []
        if (itemList.find(item => item.numItem == newItem[0].numItem)) {
            newItemList = itemList.map(item => {
                if (item.numItem == newItem[0].numItem) {
                    return { ...item, ...newItem[0] }
                } else {
                    return item
                }
            })
        } else {
            newItemList = [...itemList, ...newItem]
        }
        if (newItem[0].itemValue >= Infinity || isNaN(newItem[0].itemValue)) {
            setAlert(<Alert severity="error">Por favor, insira os dados novamente!</Alert>)
            return clear()
        }
        console.log(newItemList)
        ItemListContext.setItemList(newItemList)
        clear()
    }

    const editItem = (ref: number) => {
        if (SalesContext.sales.length != 0) return alertHandle()
        setItemInfo(ItemListContext.itemList[ItemListContext.itemList.findIndex(item => item.numItem == ref)])
        deleteItem(ref)
    }

    const deleteItem = async (ref: number) => {
        if (SalesContext.sales.length != 0) return alertHandle()
        let itemList = ItemListContext.itemList
        let newItemList = itemList.map(item => {
            if (item.numItem == ref) {
                item.active = false
            }
            return item
        })
        console.log("newItemList", newItemList)
        ItemListContext.setItemList(newItemList)
    }

    const clear = () => {
        setItemInfo({
            itemValue: "",
            item: "",
            numItem: 0,
            itemRef: 0,
            active: true
        })
    }

    useEffect(() => {
        const clearAlert = setTimeout(() => {
            setAlert(<p></p>)
        }, 5000)

        return () => clearTimeout(clearAlert)
    })

    return (
        <div>
            <AlertModal visible={alertVisible} closeHandler={closeAlertHandle} text={"Não é possível alterar itens com vendas em aberto!"} start={false}/>
            <Modal
                aria-labelledby="modal-title"
                open={props.visible}
                onClose={() => props.closeItemHandler()}
                className={document.querySelector('.main')?.classList.contains('darkThemed') ? "dark-theme-modal" : ""}
                width="650px"
                blur
                preventClose={itemInfo.itemRef || itemInfo.itemValue || itemInfo.item ? true : false}
            >
                <Modal.Header>
                    <Col>
                        <Text id="modal-title" size={22} transform="full-width">
                            Gerenciador de Itens
                        </Text>
                        <Spacer y={0.5} />

                    </Col>
                </Modal.Header>
                <Modal.Body>
                    <Col >
                        <Row >
                            <OrdinaryInput
                                label="Referência"
                                name="itemRef"
                                handleChange={handleItemInfoChange}
                                value={itemInfo.itemRef}
                            />
                            <OrdinaryInput
                                label="Descrição"
                                name="item"
                                handleChange={handleItemInfoChange}
                                value={itemInfo.item}
                                string="text"
                                large
                            />
                            <OrdinaryInput
                                label="Valor"
                                name="itemValue"
                                handleChange={handleItemInfoChange}
                                value={itemInfo.itemValue}
                                string="text"
                            />
                            <Button
                                onClick={addItem}
                                className='is-success'
                                text={<i className="bi bi-check-lg is-size-4"></i>}
                                disabled={!itemInfo.item || itemInfo.itemValue == "" || itemInfo.itemRef == 0 ? true : false}
                            />
                        </Row>
                        <Spacer y={0.5} />
                        {alert}
                        <hr />
                        <Spacer y={0.5} />
                        <Col className="items-container">
                            <Row justify='space-between'>
                                <Text b >Referência</Text>
                                <Text b css={{ "transform": "translateX(-130px)" }}>Descrição</Text>
                                <Text b css={{ "transform": "translateX(-110px)" }}>Valor</Text>
                            </Row>
                            {ItemListContext.itemList?.sort((a, b) => a.itemRef - b.itemRef).map((item, index: number) => {
                                if (item.active) return (
                                    <>
                                        <div key={index} className="items-div">
                                            <p>{item.itemRef}</p>
                                            <p>{item.item}</p>
                                            {/* @ts-ignore */}
                                            <p >{item.itemValue.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>
                                            <div>
                                                <Tooltip color="primary" title="Alterar">
                                                    <button onClick={() => editItem(item.numItem)}>
                                                        <i className="bi bi-pencil-square"></i>
                                                    </button>
                                                </Tooltip>
                                                <button onClick={() => deleteItem(item.numItem)}>
                                                    <Tooltip title="Deletar">
                                                        <i className="bi bi-trash3"></i>
                                                    </Tooltip>
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )
                            })}
                        </Col>
                    </Col>
                </Modal.Body>
            </Modal>
        </div>
    )
}