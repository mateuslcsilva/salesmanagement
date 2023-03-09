import { db } from "../utils/firebase/firebase";
import { collection, addDoc, getDocs, query, where, doc, getDoc, updateDoc } from "firebase/firestore";

export const ItemsList = [
    {
        numItem: 1,
        item: 'Porção de Asinha',
        itemValue: 29.90
    },
    {
        numItem: 2,
        item: 'Coca 350ml',
        itemValue: 6.50
    },
    {
        numItem: 3,
        item: 'Coca 2L ',
        itemValue: 12.00
    },
    {
        numItem: 4,
        item: 'Porção Batata',
        itemValue: 29.90
    },
    {
        numItem: 5,
        item: 'Porção Alcatra',
        itemValue: 49.90
    },
    {
        numItem: 6,
        item: 'Devassa 600ml',
        itemValue: 9.90
    },
    {
        numItem: 7,
        item: 'Devassa Litrão',
        itemValue: 12.50
    },
    {
        numItem: 8,
        item: 'Heineken LongNeck',
        itemValue: 8.00
    },
    {
        numItem: 9,
        item: 'Heineken 600ml',
        itemValue: 12.90
    },
    {
        numItem: 10,
        item: 'Água',
        itemValue: 6.00
    }
]


const subirItemList = async () => {
    await updateDoc(doc(db, "empresas", "e"), {
        items: ItemsList
    }).then(res => console.log(res))
    .catch(err => console.log(err.message))
}

subirItemList()


/* const deletarVendas = async () => {
    await updateDoc(doc(db, "empresas", "b"), {
        sales: []
    }).then(res => console.log(res))
    .catch(err => console.log(err.message))
}

deletarVendas() */