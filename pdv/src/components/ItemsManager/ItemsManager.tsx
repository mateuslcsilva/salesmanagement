import { Modal, Col, Spacer, Text, Row } from '@nextui-org/react'
import './styles.css'
import Button from '../../components/Button/Button'
import React, { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import { OrdinaryInput } from '../OrdinaryInput/OrdinaryInput'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase/firebase'
import { useAuthContext } from '../../utils/contexts/AuthProvider'

export const ItemsManager = (props: any) => {

    const [itemList, setItemList] = useState<Array<itemType>>([])
    const AuthContext = useAuthContext()

    interface itemType {
        numItem: number;
        item: string;
        itemValue: string
    }

    const getItems = async () => {
        if (AuthContext.currentUser.id == '') return false
        let docRef = doc(db, "empresas", `${AuthContext.currentUser.id}`)
        let data = await getDoc(docRef)
            .then(res => {
                setItemList(res.data()?.items)
            })
    }

    useEffect(() => {
        getItems()
    }, [])

    useEffect(() => {
        console.log(itemList)
    })

    return (
        <div>
            <Modal
                aria-labelledby="modal-title"
                open={props.visible}
                onClose={() => props.closeItemHandler()}
                className={document.querySelector('.main')?.classList.contains('darkThemed') ? "dark-theme-modal" : ""}
                width="650px"
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
                            />
                            <OrdinaryInput
                                label="Descrição"
                                string
                            />
                            <OrdinaryInput
                                label="Valor"
                            />
                            <Button
                                /* onClick={closeSale} */
                                className='is-success'
                                text={<i className="bi bi-check-lg is-size-4"></i>}
                            /* disabled={Array.isArray(sale) || !sale.numTable || (paymentMethods == "Forma de Pagamento") ? true : false} */
                            />
                        </Row>
                        <Spacer y={0.5} />
                        <hr />
                        <Spacer y={0.5} />
                        <Col css={{ "width": "500px", "marginLeft": "50px" }}>
                            <Row justify='space-between'>
                                <Text >Referência</Text>
                                <Text css={{ "marginLeft": "-100px" }}>Descrição</Text>
                                <Text >Valor</Text>
                            </Row>
                            {itemList.map((item, index: number) => {
                                return (
                                    <>
                                    <div key={index} className="items-div">
                                        <p>{item.numItem}</p>
                                        <p>{item.item}</p>
                                        {/* @ts-ignore */}
                                        <p >{item.itemValue.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>
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