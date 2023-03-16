import { Modal, Col, Spacer, Text, Row, Tooltip } from '@nextui-org/react'
import './styles.css'
import Button from '../../components/Button/Button'
import React, { useEffect, useReducer, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import { OrdinaryInput } from '../OrdinaryInput/OrdinaryInput'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase/firebase'
import { useAuthContext } from '../../utils/contexts/AuthProvider'
import { initialSignIn } from '../../types/Login/loginTypes'

export const ItemsManager = (props: any) => {

    const initialItemInfo = {} as itemType

    const AuthContext = useAuthContext()
    const [itemList, setItemList] = useState<Array<itemType>>([])
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

    interface itemType {
        numItem: number;
        item: string;
        itemValue: number
    }

    const getItems = async () => {
        if (AuthContext.currentUser.id == '') return false
        let docRef = doc(db, "empresas", `${AuthContext.currentUser.id}`)
        let data = await getDoc(docRef)
            .then(res => {
                setItemList(res.data()?.items)
            })
    }

    const addItem = async () => {
        const convert = {numItem: Number(itemInfo.numItem), itemValue: Number(itemInfo.itemValue)}
        const newItem = [{...itemInfo, ...convert}]
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
            numItem: 0
        })
    }

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
                                name="numItem"
                                handleItemInfoChange={handleItemInfoChange}
                                value={itemInfo.numItem}
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
                            /* disabled={Array.isArray(sale) || !sale.numTable || (paymentMethods == "Forma de Pagamento") ? true : false} */
                            />
                        </Row>
                        <Spacer y={0.5} />
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
                                            <p>{item.numItem}</p>
                                            <p>{item.item}</p>
                                            {/* @ts-ignore */}
                                            <p >{item.itemValue.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>
                                            <div>
                                                <Tooltip color="primary" content="Alterar">
                                                    <button onClick={() => editItem(item.numItem)}>
                                                        <i className="bi bi-pencil-square"></i>
                                                    </button>
                                                </Tooltip>
                                                <Tooltip content="Deletar">
                                                    <button onClick={() => deleteItem(item.numItem)}>
                                                        <i className="bi bi-trash3"></i>
                                                    </button>
                                                </Tooltip>
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