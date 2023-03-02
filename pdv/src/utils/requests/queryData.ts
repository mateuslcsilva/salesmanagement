import { db } from "../../utils/firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export const queryData = async (queryType :string, whereParam: string, value :any) => {
    switch(queryType){
      case 'accountInfo': 
          const accountInfo = await getDocs(query(collection(db, "empresas"), where(`workplace.${whereParam}`, "==", value)))
        .then(response => {
          if(response.size > 1) return 'Existe mais de uma empresa com esse nome, entre em contato com o suporte!!' //todo: testar
          if(response.size < 1) {
            return 'Empresa não encontrada! Por favor, faça o cadastro!'
          }  //todo: testar
          let idObject = {id: response.docs[0].id, users: response.docs[0].data().workplace.users}
          return idObject
        })
        return accountInfo
    }




  }