import React, { useState } from 'react'
import Button from '../Button/Button'
import { useAuthContext } from '../../utils/contexts/AuthProvider'
import { currentDate, currentTime } from '../../utils/consts'
import { updateDoc, doc, arrayUnion } from 'firebase/firestore'
import { db, DOC_PATH } from '../../utils/firebase/firebase'

export const ReportDetais = (props: any) => {
    const AuthContext = useAuthContext()
    const [newText, setNewText] = useState("")

    const setConversaTexto = async () => {
        if(!newText) return
        const newTextObj = {
            texto: newText,
            usuario: AuthContext.currentUser.userName,
            data: currentDate,
            hora: currentTime
        }
        let newConversa = {conversa: [...props.report.conversa, newTextObj]}
        props.setReport({...props.report, ...newConversa})
        setNewText("")
    }

    return (
        <div className="report-details">
            <strong><span>Assunto: </span></strong>
            <span>{props.report.assunto}</span>
            <br /><br />
            <strong>
                <p>Histórico:</p>
            </strong>
            <div className='messagens-container'>
                {props.report.conversa.map((mensagem: any) => {
                    return (
                        <div className='mensagem-div'>
                            <p>{`${mensagem.usuario}: ${mensagem.texto}`}</p>
                            <span>{`${mensagem.hora}, ${mensagem.data}`}</span>
                            <hr />
                        </div>
                )
                })}
            </div>
            <div className="report-problem-input-div">
                <input
                    type="text"
                    className="report-problem-input"
                    id="reportProblemInput"
                    autoComplete='off'
                    onChange={(e) => setNewText(e.target.value)}
                    value={newText}
                    name="report-problem-input"
                    placeholder='Acrescente algo à conversa.'
                    required
                />
                <Button 
                text={<i className="bi bi-send"></i>} 
                className="is-info" 
                style={{ "color": "#4a4a4a !important" }}
                onClick={setConversaTexto}
                />
            </div>
        </div>
    )
}