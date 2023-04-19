import React, { useEffect, useState } from 'react'
import { Modal } from '@nextui-org/react'
import './styles.css'
import Button from '../Button/Button'
import { useAuthContext } from '../../utils/contexts/AuthProvider'
import { updateDoc, doc, arrayUnion, getDoc } from 'firebase/firestore'
import { DOC_PATH, db } from '../../utils/firebase/firebase'
import { ReportDetais } from './ReportDetails'
import { currentDate, currentTime } from '../../utils/consts'
import { reportType, conversationType } from '../../types/reportProblemTypes'

export const ProblemReportModal = (props: any) => {


    const initialReportState: reportType = {
        assunto: "",
        conversa: [] as Array<conversationType>,
        data: "",
        hora: "",
        usuario: "",
        numero: 0,
        status: "pendente",
        reportId: ""
    }

    const AuthContext = useAuthContext()
    const [newReport, setNewReport] = useState<reportType>(initialReportState)
    const [report, setReport] = useState<reportType>({} as reportType)
    const [reportList, setReportList] = useState<Array<reportType>>([])
    const [modalState, setModalState] = useState<string>("reportList")

    useEffect(() => {
        console.log("new reprt: ",newReport)
        console.log("report list: ", reportList)
        console.log("report: ", report)
        console.log("modalState: ", modalState)
    }, [report, newReport, reportList])

    useEffect(() => {
        getReportList()
    }, [AuthContext.currentUser?.id])

    useEffect(() => {
        const sameReport = reportList.find(same => same.numero == report.numero)
        if(report.conversa?.length != sameReport?.conversa.length) updateReport()
    }, [report])

    const getReportList = async () => {
        if (AuthContext.currentUser?.id == '' || !AuthContext.currentUser?.id) return false
        let docRef = doc(db, DOC_PATH, `${AuthContext.currentUser.id}`)
        let data = await getDoc(docRef)
            .then(res => {
                let data = res.data()?.reports
                setReportList(data)
            })
    }

    const sendReport = async () => {
        if(!newReport.conversa || !newReport.assunto) return
        let reportData = {
            usuario: AuthContext.currentUser.userName,
            /* @ts-ignore */
            numero: reportList.map(report => report.numero).sort((a, b) => a - b).at(-1) + 1,
            reportId: Date.now().toString()
        }
        if (reportList.find(existentReport => existentReport.assunto.toLocaleLowerCase() == newReport.assunto.toLocaleLowerCase())) return window.alert("Esse assunto já está sendo tratado.")

        await updateDoc(doc(db, DOC_PATH, AuthContext.currentUser.id), {
            reports: arrayUnion({ ...newReport, ...reportData })
        })
        clear()
        getReportList()
    }

    const updateReport = async () => {
        await updateDoc(doc(db, DOC_PATH, AuthContext.currentUser.id), {
            reports:  [...reportList.filter(diferentReports => diferentReports.reportId != report.reportId), report ]
        })
        getReportList()
    }

    const setCurrentReport = (id :string) => {
        let report = reportList.find(report => report.reportId == id)
        if(!report) return
        setReport(report)
        setModalState("reportDetails")
    }

    const clear = () => {
        setNewReport(initialReportState)
        setModalState("reportList")
    }

    const customizedCloseHandler = () => {
        clear()
        props.closeReportHandler()
    }


    return (
        <Modal
            aria-labelledby="modal-title"
            open={props.visible}
            onClose={customizedCloseHandler}
            className={document.querySelector('.main')?.classList.contains('darkThemed') ? "dark-theme-modal" : ""}
            width="650px"
            blur
        >
            <Modal.Header>
                {modalState == "reportList" && <p className="report-list-title">Chamados</p>}
                {modalState == "newReport" && <p className="report-list-title">Novo Chamado</p>}
                {modalState == "reportDetails" && <p className="report-list-title">{`Chamado ${report.numero}`}</p>}
            </Modal.Header>
            <Modal.Body>
                {
                    modalState == "newReport" &&
                    <>
                        <div className="report-problem-input-div">
                            <input
                                type="text"
                                className="report-problem-input"
                                id="reportProblemInput"
                                autoComplete='off'
                                onChange={(e) => {
                                    let newData = { assunto: e.target.value }
                                    setNewReport({ ...newReport, ...newData })
                                }}
                                value={newReport.assunto}
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
                                    let newData = { conversa: [{
                                        usuario: AuthContext.currentUser.userName,
                                        data: currentDate,
                                        hora: currentTime,
                                        texto: e.target.value
                                    }]}
                                    setNewReport({ ...newReport, ...newData })
                                }}
                                value={newReport.conversa[0]?.texto}
                                name="report-problem-input"
                                required
                            />
                        </div>
                    </>
                }

                {modalState == "reportList" &&
                    <>
                        <div className='report-list-helper'>
                            <p>Número</p>
                            <p>Assunto</p>
                            <p>Status</p>
                        </div>
                        {reportList.map(report => {
                            return (
                                <div className='report-list-div'>
                                    <p>{report.numero}</p>
                                    <p><abbr title={report.assunto}>{report.assunto}</abbr></p>
                                    <p>{report.status}</p>
                                    <i 
                                    className="bi bi-box-arrow-in-up-right"
                                    onClick={() => setCurrentReport(report.reportId)}
                                    ></i>
                                </div>
                            )
                        })}
                    </>
                }

                {modalState == "reportDetails" && 
                    <ReportDetais report={report} setReport={setReport} />
                }
            </Modal.Body>
            <Modal.Footer>
                {modalState != "reportList" && <Button text="Voltar" className="report-problem-button" onClick={() => setModalState("reportList")}/>}
                {modalState == "newReport" && <Button text="Enviar" className="is-info" style={{ "color": "#4a4a4a !important" }} onClick={sendReport} />}
                {modalState == "reportList" && <Button text="+ Chamado" className="is-info" style={{ "color": "#4a4a4a !important" }} onClick={() => setModalState("newReport")} />}
            </Modal.Footer>
        </Modal>
    )
}