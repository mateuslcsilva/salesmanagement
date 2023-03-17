import { Modal, Col, Spacer, Text, Row } from '@nextui-org/react'
import Tooltip from '@mui/material/Tooltip'
import './styles.css'
import Button from '../../components/Button/Button'
import React, { useEffect, useReducer, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import { OrdinaryInput } from '../OrdinaryInput/OrdinaryInput'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase/firebase'
import { useAuthContext } from '../../utils/contexts/AuthProvider'
import { itemType } from '../../types/itemType/itemType'
import { Alert } from '@mui/material'

export const ItemsManager = (props: any) => {

    const initialItemInfo = {} as itemType

    const AuthContext = useAuthContext()
    const [itemList, setItemList] = useState<Array<itemType>>([])
    const [alert, setAlert] = useState(<p></p>)
    const [itemInfo, setItemInfo] = useReducer(
        (currentValues: itemType, newValues: itemType) => {
          return { ...currentValues, ...newValues }
        },
        initialItemInfo
      )
    
      const handleItemInfoChange = (event: {
        target: { name: string; value: string }
      }) => {
        const { name, value } = event.target
        const newValues ={ [name]: value } 
        setItemInfo({ ...itemInfo, ...newValues });
      };

    const getItems = async () => {
        if (AuthContext.currentUser.id == '') return false
        let docRef = doc(db, "empresas", `${AuthContext.currentUser.id}`)
        let data = await getDoc(docRef)
            .then(res => {
                setItemList(res.data()?.items)
            })
    }

    const addItem = async () => {
        if (itemList.find(item => item.itemRef == itemInfo.itemRef)) return setAlert(<Alert severity="error" >Referência já cadastrada!</Alert>)
        //@ts-ignore
        const convert = { itemRef: Number(itemInfo.itemRef), itemValue: typeof itemInfo.itemValue == "number" ? itemInfo.itemValue : Number(itemInfo.itemValue.replaceAll(',', '.')), numItem : itemList.map(item => item.numItem).sort((a, b) => a - b).at(-1) + 1}
        const newItem = [{...itemInfo, ...convert}]
        if (newItem[0].itemValue >= Infinity || isNaN(newItem[0].itemValue)) {
            setAlert(<Alert severity="error">Por favor, insira os dados novamente!</Alert>)
            return clear()
        }
        await updateDoc(doc(db, "empresas", AuthContext.currentUser.id), {
            items: [...itemList, ...newItem]
        }).then(res => console.log(res))
            .catch(err => console.log(err.message))
            getItems()
            clear()
    }

    const editItem = (ref :number) => {
        setItemInfo(itemList[itemList.findIndex(item => item.numItem == ref)])
        deleteItem(ref)
    }

    const deleteItem = async (ref: number) => {
        await updateDoc(doc(db, "empresas", AuthContext.currentUser.id), {
            items: itemList.filter(item => item.numItem != ref)
        }).then(res => console.log(res))
            .catch(err => console.log(err.message))
            getItems()
    }

    const clear = () => {
        setItemInfo({
            itemValue: 0,
            item: "",
            numItem: 0,
            itemRef: 0
        })
    }

    /* useEffect(() => {
        const clearAlert = setTimeout(() => {
            setAlert(<p></p>)
        }, 5000)

        return () => clearTimeout(clearAlert)
    }) */

    useEffect(() => {
        getItems()
    }, [AuthContext.currentUser.id])

    useEffect(() => {
        console.log(itemList)
        console.log("itemInfo: ", itemInfo)
    })

    return (
        <div>
            <Modal
                aria-labelledby="modal-title"
                open={props.visible}
                onClose={() => props.closeItemHandler()}
                className={document.querySelector('.main')?.classList.contains('darkThemed') ? "dark-theme-modal" : ""}
                width="650px"
                blur
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
                                handleItemInfoChange={handleItemInfoChange}
                                value={itemInfo.itemRef}
                            />
                            <OrdinaryInput
                                label="Descrição"
                                name="item"
                                handleItemInfoChange={handleItemInfoChange}
                                value={itemInfo.item}
                                string
                                large
                            />
                            <OrdinaryInput
                                label="Valor"
                                name="itemValue"
                                handleItemInfoChange={handleItemInfoChange}
                                value={itemInfo.itemValue}
                                string
                            />
                            <Button
                                onClick={addItem}
                                className='is-success'
                                text={<i className="bi bi-check-lg is-size-4"></i>}
                                disabled={!itemInfo.item || itemInfo.itemValue == 0 || itemInfo.itemRef == 0 ? true : false}
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
                            {itemList.map((item, index: number) => {
                                return (
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
                <Modal.Footer>

                </Modal.Footer>
            </Modal>
        </div>
    )
}