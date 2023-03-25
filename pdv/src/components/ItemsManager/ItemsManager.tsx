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
import { Alert, getNativeSelectUtilityClasses } from '@mui/material'
import { sale } from '../../types/sale/sale'

export const ItemsManager = (props: any) => {

    const initialItemInfo = {} as itemType

    const AuthContext = useAuthContext()
    const [itemList, setItemList] = useState<Array<itemType>>([])
    const [saleList, setSaleList] = useState<Array<sale>>([])
    const [alert, setAlert] = useState(<p></p>)
    const [itemInfo, setItemInfo] = useReducer(
        (currentValues: itemType, newValues: itemType) :itemType => {
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
                setSaleList(res.data()?.sales)
            })
    }

    const addItem = async () => {
        /* if(saleList) return window.alert("Você não pode alterar a lista de itens enquanto houverem vendas abertas!") */
        if (itemList.find(item => item.active && item.itemRef == itemInfo.itemRef)) return setAlert(<p className='error-label' ><i className="bi bi-x-octagon"></i>Referência já cadastrada!</p>)
        const convert = { active: true, 
            itemRef: Number(itemInfo.itemRef), 
            itemValue: typeof itemInfo.itemValue == "number" ? itemInfo.itemValue : Number(itemInfo.itemValue.replaceAll(',', '.')), 
            //@ts-ignore
            numItem : itemInfo.numItem ? itemInfo.numItem : itemList.map(item => item.numItem).sort((a, b) => a - b).at(-1) + 1
        }
        const newItem = [{...itemInfo, ...convert}]
        let newItemList = []
        if(itemList.find(item => item.numItem == newItem[0].numItem)){
            newItemList = itemList.map(item => {
                if(item.numItem == newItem[0].numItem){
                    return {...item, ...newItem[0]}
                } else{
                    return item
                }
            })
        } else{
            newItemList = [...itemList, ...newItem]
        }
        console.log(newItemList)
        if (newItem[0].itemValue >= Infinity || isNaN(newItem[0].itemValue)) {
            setAlert(<Alert severity="error">Por favor, insira os dados novamente!</Alert>)
            return clear()
        }
        await updateDoc(doc(db, "empresas", AuthContext.currentUser.id), {
            items: newItemList
        })
            getItems()
            clear()
    }

    const editItem = (ref :number) => {
        /* if(saleList) return window.alert("Você não pode alterar a lista de itens enquanto houverem vendas abertas!") */
        setItemInfo(itemList[itemList.findIndex(item => item.numItem == ref)])
        deleteItem(ref)
    }

    const deleteItem = async (ref: number) => {
        /* if(saleList) return window.alert("Você não pode alterar a lista de itens enquanto houverem vendas abertas!") */
        setItemList(itemList.map(item => {
            if(item.numItem == ref){
                item.active = false
            }
            return item
        }))
        await updateDoc(doc(db, "empresas", AuthContext.currentUser.id), {
            items: itemList
        })
            getItems()
    }

    const attItemList = async () => {
        await updateDoc(doc(db, "empresas", AuthContext.currentUser.id), {
            items: itemList.filter(item => item.active)
        })
            getItems()
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

    useEffect(() => {
        getItems()
    }, [AuthContext.currentUser.id])

    useEffect(() => {
        console.log(itemList)
        console.log("itemInfo: ", itemInfo)/* 
        attItemList() */
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
                            {itemList.sort((a, b) => a.itemRef - b.itemRef).map((item, index: number) => {
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
                <Modal.Footer>

                </Modal.Footer>
            </Modal>
        </div>
    )
}