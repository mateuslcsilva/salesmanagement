import { db } from "../../utils/firebase/firebase";
import { arrayUnion, collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";

export const queryData = async (queryType: string, whereParam: string, value: any) => {
  switch (queryType) {
    case 'accountInfo':
      const accountInfo = await getDocs(query(collection(db, "empresas"), where(`${whereParam}`, "==", value.toLowerCase())))
        .then(response => {
          if (response.size > 1) return 'Existe mais de uma empresa com esse nome, entre em contato com o suporte!!' //todo: testar
          if (response.size < 1) {
            return 'Empresa não encontrada! Por favor, faça o cadastro!'
          }  //todo: testar
          let data = response.docs[0] // receber uma informação é a única possível opção aqui, entretanto, o firebase sempre entrega um array
          let idObject = { id: data.id, users: data.data().users }
          return idObject
        })
      return accountInfo
      break
    case 'getById':
      let docRef = doc(db, "empresas", `${value}`)
      let data = await getDoc(docRef)
      .then(res => res.data())
      /* let docRef = doc(db, "empresas", value)
      let data = await getDoc(docRef)
        .then(response => {
          return response.data()
        })
        .catch(err => {
          return {
            error: true,
            message: err.message
          }
        })*/
      return data 
      break
      case 'itemsUpdate':
        await updateDoc(doc(db, "empresas", value.id), {
            items: arrayUnion(value.item)
      }).then(res => console.log(res))
      .catch(err => console.log(err.message))
      break
      case 'saleUpdate':
        await updateDoc(doc(db, "empresas", value.id), {
            sales: arrayUnion(value.sale)
      }).then(res => console.log(res))
      .catch(err => console.log(err.message))
      break
  }




}