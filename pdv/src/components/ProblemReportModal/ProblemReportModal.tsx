import React, { useEffect, useState } from 'react'
import { Modal } from '@nextui-org/react'
import './styles.css'
import Button from '../Button/Button'
import { useAuthContext } from '../../utils/contexts/AuthProvider'
import { updateDoc, doc, arrayUnion, getDoc } from 'firebase/firestore'
import { DOC_PATH, db } from '../../utils/firebase/firebase'

export const ProblemReportModal = (props :any) => {
    interface reportType {
        assunto: string,
        problema: string,
        data: string,
        hora: string,
        usuario: string,
        reportId: number
    }

    const initialReportState = {
        assunto: "",
        problema: "",
        data: "",
        hora: "",
        usuario: "",
        reportId: 0
    }

    const AuthContext = useAuthContext()
    const [report, setReport] = useState<reportType>({} as reportType)
    const [reports, setReports] = useState<Array<reportType>>([])

    useEffect(() => {
        console.log(report)
    }, [report])

    useEffect(() => {
        getReports()
    }, [])

    const getReports = async () => {
        if (AuthContext.currentUser.id == '' || !AuthContext.currentUser.id) return false
        let docRef = doc(db, DOC_PATH, `${AuthContext.currentUser.id}`)
        let data = await getDoc(docRef)
          .then(res => {
            let data = res.data()?.reports
            setReports(data)
          })
    }

    const sendReport = async () => {
        let current = new Date
        let currentDay = current.getDate().toString().length < 2 ? '0' + current.getDate() : current.getDate()
        let currentMonth = current.getMonth().toString().length < 2 ? '0' + (current.getMonth() + 1) : (current.getMonth() + 1)
        let currentDate = currentDay + '/' + currentMonth + '/' + current.getFullYear()
        let currentTime = current.getHours() + ':' + (current.getMinutes() < 10 ? "0" + current.getMinutes() : current.getMinutes())
        let reportData = {
            data: currentDate,
            hora: currentTime,
            usuario: AuthContext.currentUser.userName,
            /* @ts-ignore */
            reportId:  reports.sort((a, b) => b.reportId - a.reportId).at(-1) + 1 || 1
        }
        if(reports.find(existentReport => existentReport.assunto.toLocaleLowerCase() == report.assunto.toLocaleLowerCase())) return window.alert("Esse assunto já está sendo tratado.")
        
        await updateDoc(doc(db, DOC_PATH, AuthContext.currentUser.id), {
            reports: arrayUnion({...report, ...reportData})
          })
          clear()
          getReports()
    }

    const clear = () => {
        setReport(initialReportState)
    }


    return(
        <Modal
        aria-labelledby="modal-title"
        open={props.visible}
        onClose={props.closeReportHandler}
        className={document.querySelector('.main')?.classList.contains('darkThemed') ? "dark-theme-modal" : ""}
        width="650px"
        blur
    >
        <Modal.Header>
            
        </Modal.Header>
        <Modal.Body>
        <div className="report-problem-input-div">
                <input 
                type="text"
                className="report-problem-input"
                id="reportProblemInput"
                autoComplete='off'
                onChange={(e) => {
                    let newData = {assunto: e.target.value}
                    setReport({...report, ...newData})
                }}
                value={report.assunto}
                name="report-problem-input"
                required 
                />
                <label htmlFor="reportProblemInput" className="report-problem-label">Assunto</label>
            </div>
        <div className="report-problem-input-div">
                <textarea 
                placeholder='Descreva detalhadamente o problema.'
                className="report-problem-input large"
                id="reportProblemInputLarge"
                autoComplete='off'
                onChange={(e) => {
                    let newData = {problema: e.target.value}
                    setReport({...report, ...newData})
                }}
                value={report.problema}
                name="report-problem-input"
                required 
                />
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button text="Voltar" className="report-problem-button" />
            <Button text="Enviar" className="is-info" style={{"color": "#4a4a4a !important"}} onClick={sendReport}/>
        </Modal.Footer>
    </Modal>
    )
}