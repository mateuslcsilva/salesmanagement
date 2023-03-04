import { doc, getDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useAuthContext } from "../../utils/contexts/AuthProvider.js";
import { useOrderContext } from "../../utils/contexts/OrderContext.js";
import { db } from "../../utils/firebase/firebase.js";
import './styles.css'

const ItemsListInput = (props: any) => {
    const AuthContext = useAuthContext()
    const orderContext = useOrderContext()
    const [selectedItem, setSelectedItem] = useState<number>(1)
    const [itemList, setItemList] = useState<itemType[]>([])
    const [currentUserId, setCurrentUserId] = useState<string>()
    const [itemListActive, setItemListActive] = useState<boolean>(false)

    interface itemType {
        numItem: number;
        item: string;
        itemValue: number
    } 

    const getItems = async () => {
        if(AuthContext.currentUser.id == '') return false
        let docRef = doc(db, "empresas", `${AuthContext.currentUser.id}`)
        let data = await getDoc(docRef)
        .then(res => res.data()?.items)
        setItemList(data)
    }

    const selectItem = (numItem: number) => {
        setSelectedItem(numItem)
        orderContext.setCurrentOrder(numItem)
        setItemListActive(false)
    }

    const getItemText = (typeParam :string, value :number | undefined) => {
        if(AuthContext.currentUser.id == '') return
        if(value == undefined) return
        if (typeParam == "numItem"){
            let index = itemList.findIndex(item => item.numItem == value)
            if(index < 0) return
            let text = (itemList[index]?.numItem < 10 ? '0' + itemList[index]?.numItem : itemList[index]?.numItem.toString()) + ' - ' + itemList[index]?.item + ' - ' +  itemList[index]?.itemValue.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})
            return text
        }
        if(!itemList[value]) return ''
        if (typeParam == "index") {
            let text = (itemList[value]?.numItem < 10 ? '0' + itemList[value]?.numItem : itemList[value]?.numItem.toString()) + ' - ' + itemList[value]?.item + ' - ' + itemList[value]?.itemValue.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})
            return text
        }
    }

    useEffect(() => {
        console.log(selectedItem)
    }, [selectedItem])

    useEffect(() => {
        setCurrentUserId(AuthContext.currentUser.id)
    }, [AuthContext.currentUser.id])

    useEffect(() => {
        getItems()
    }, [currentUserId])

    return (
        <section>
            <input
                type="text"
                autoComplete="off"
                id="itemListInput"
                className={props.className + ' input'}
                placeholder={props.placeholder}
                onChange={props.onChange}
                onClick={() => setItemListActive(true)}
                value={getItemText("numItem", orderContext.currentOrder)}
                disabled={props.disabled}
            />

            <div id='itemList' className={itemListActive? "active" : ""}>
                {itemList.map((item: any, index: number): any => {
                    return (
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

