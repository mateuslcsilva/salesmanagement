import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../utils/contexts/AuthProvider.js";
import { useOrderContext } from "../../utils/contexts/OrderContext.js";
import './styles.css'
import { itemType } from "../../types/itemType/itemType.js";
import { useItemListContext } from "../../utils/contexts/ItemsProvider.js";

const ItemsListInput = (props: any) => {
    const AuthContext = useAuthContext()
    const orderContext = useOrderContext()
    const ItemListContext = useItemListContext()
    const [currentOrder, setCurrentOrder] = useState<string>("")
    const [itemListActive, setItemListActive] = useState<boolean>(false)

    const selectItem = (numItem: number) => {
        orderContext.setCurrentOrder(numItem)
        setItemListActive(false)
    }

    const getItemText = (typeParam :string, value :number | undefined) :string => {
        if(!AuthContext.currentUser?.id) return ''
        const itemList = ItemListContext.itemList
        if(value == undefined) return ''
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
        return ''
    }

    const filterItemList = (param :string) :Array<itemType> => {
        const itemList = ItemListContext.itemList
        if(!itemList) return []
        const newItemList = itemList.filter(item => getItemText("numItem", item.numItem)?.toLowerCase().includes(currentOrder.toLowerCase()))
        return newItemList
    }

    const focusItem = (e :React.KeyboardEvent<HTMLElement>) => {
        if(e.key == "ArrowDown") {
            document.getElementById((1 + Number(e.target.id)).toString())?.focus()
        }
        if(e.key == "ArrowUp") {
            document.getElementById((Number(e.target.id) - 1).toString())?.focus()
        }
    }

    useEffect(() => {
        setCurrentOrder(getItemText("numItem", orderContext.currentOrder))
        if(orderContext.currentOrder == 0) document.getElementById('itemListInput')?.focus()
    }, [orderContext.currentOrder])

    useEffect(() => {
        setItemListActive(false)
    }, [props.disabled])

    useEffect(() => {
        if(currentOrder.length > 0 && !orderContext.currentOrder) setItemListActive(true)
    }, [currentOrder])

    return (
        <section onKeyDown={(e) => e.key == "Escape" ? setItemListActive(false) : {} }>
            <input
                type="text"
                autoComplete="off"
                id="itemListInput"
                className={props.className + ' input'}
                placeholder={props.placeholder}
                onChange={(e) => setCurrentOrder(e.target.value.toString())}
                onClick={() => setItemListActive(itemListActive => !itemListActive)}
                value={currentOrder}
                disabled={props.disabled}
                onKeyDown={(e) => {
                    if(e.key == "ArrowDown") {
                        document.getElementById("0".toString())?.focus()
                    }
                    if(e.key == "F1"){
                        e.preventDefault()
                        props.updateSales()
                    }
                    console.log(e.key)
                }}
            />

            <div 
            id='itemList' 
            className={itemListActive? "active primary-text" : "primary-text"} 
            style={itemListActive ? {'height':`${25 + filterItemList(currentOrder).length * 25}px`, 'maxHeight': '220px'} : {}}
            >
                {
                filterItemList(currentOrder)
                .filter(item => item.active)
                .sort((a, b) => a.itemRef - b.itemRef)
                .map((item: any, index: number): any => {
                    return (
                        <button 
                        className="item-btn" 
                        onClick={(e) => selectItem(item.numItem)} 
                        key={index} 
                        id={index.toString()}
                        onKeyDown={(e) => focusItem(e)}
                        >
                            {getItemText("numItem", item.numItem)}
                        </button>
                    )
                })
                }
            </div>
        </section>
    )
}

export default ItemsListInput