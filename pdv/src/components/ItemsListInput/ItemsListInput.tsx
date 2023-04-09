import { doc, getDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useAuthContext } from "../../utils/contexts/AuthProvider.js";
import { useOrderContext } from "../../utils/contexts/OrderContext.js";
import { db } from "../../utils/firebase/firebase.js";
import './styles.css'
import { itemType } from "../../types/itemType/itemType.js";

const ItemsListInput = (props: any) => {
    const AuthContext = useAuthContext()
    const orderContext = useOrderContext()
    const [currentOrder, setCurrentOrder] = useState<string>()
    const [itemList, setItemList] = useState<itemType[]>([])
    const [currentUserId, setCurrentUserId] = useState<string>()
    const [itemListActive, setItemListActive] = useState<boolean>(false)

    const getItems = async () => {
        if(AuthContext.currentUser.id == '') return false
        let docRef = doc(db, "empresas", `${AuthContext.currentUser.id}`)
        let data = await getDoc(docRef)
        .then(res => res.data()?.items)
        setItemList(data)
    }

    const selectItem = (numItem: number) => {
        orderContext.setCurrentOrder(numItem)
        setItemListActive(false)
    }

    const getItemText = (typeParam :string, value :number | undefined) => {
        if(AuthContext.currentUser.id == '') return 
        if(value == undefined) return 
        if (typeParam == "numItem"){
            let index = itemList.findIndex(item => item.numItem == value)
            if(index < 0) return ""
            let text = (itemList[index]?.itemRef < 10 ? '0' + itemList[index]?.itemRef : itemList[index]?.itemRef.toString()) + ' - ' + itemList[index]?.item + ' - ' +  itemList[index]?.itemValue.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})
            return text
        }
        if(!itemList[value]) return ''
        if (typeParam == "index") {
            let text = (itemList[value]?.itemRef < 10 ? '0' + itemList[value]?.itemRef : itemList[value]?.itemRef.toString()) + ' - ' + itemList[value]?.item + ' - ' + itemList[value]?.itemValue.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})
            return text
        }
    }

    useEffect(() => {
        setCurrentUserId(AuthContext.currentUser.id)
    }, [AuthContext.currentUser.id])

    useEffect(() => {
        getItems()
    }, [currentUserId])

    useEffect(() => {
        setCurrentOrder(getItemText("numItem", orderContext.currentOrder))
    }, [orderContext.currentOrder])

    useEffect(() => {
        setItemListActive(false)
    }, [props.disabled])

    return (
        <section>
            <input
                type="text"
                autoComplete="off"
                id="itemListInput"
                className={props.className + ' input'}
                placeholder={props.placeholder}
                onChange={props.onChange}
                onClick={() => setItemListActive(itemListActive => !itemListActive)}
                value={currentOrder}
                disabled={props.disabled}
            />

            <div id='itemList' className={itemListActive? "active primary-text" : "primary-text"}>
                {itemList.sort((a, b) => a.itemRef - b.itemRef).map((item: any, index: number): any => {
                    if (item.active) return (
                        <button className="item-btn" onClick={(e) => selectItem(item.numItem)} key={index} id={item.numItem}>
                            {getItemText("index", index)}
                        </button>
                    )
                })}
            </div>
        </section>
    )
}

export default ItemsListInput

