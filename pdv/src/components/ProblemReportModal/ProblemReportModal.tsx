import React, { useEffect, useState } from 'react'
import { Modal } from '@nextui-org/react'
import './styles.css'
import Button from '../Button/Button'
import { useAuthContext } from '../../utils/contexts/AuthProvider'
import { updateDoc, doc, arrayUnion, getDoc, getDocs, collection } from 'firebase/firestore'
import { DOC_PATH, db } from '../../utils/firebase/firebase'
import { ReportDetais } from './ReportDetails'
import { currentDate, currentTime } from '../../utils/consts'
import { reportType, conversationType } from '../../types/reportProblemTypes'
import { NewReport } from './NewReport'
import { ReportList } from './ReportList'

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
    const [allReports, setAllReports] = useState<Array<{ empresa: string, reports: Array<reportType> }>>([])
    const [modalState, setModalState] = useState<string>("reportList")

    useEffect(() => {
        console.log("new reprt: ", newReport)
        console.log("report list: ", reportList)
        console.log("all reports list: ", allReports)
        console.log("report: ", report)
        console.log("modalState: ", modalState)
    }, [report, newReport, reportList])

    useEffect(() => {
        if (AuthContext.currentUser.userType == "Desenvolvedor") {
            getAllReportLists()
        } else {
            getReportList()
        }
    }, [AuthContext.currentUser?.id])

    useEffect(() => {
        if (AuthContext.currentUser.userType != "Desenvolvedor") {
            const sameReport = reportList.find(same => same.reportId == report.reportId)
            if (report.conversa?.length != sameReport?.conversa.length) {
                updateReport()
            }
        } else {
            let sameReport
            let empresa
            allReports.forEach(reports => {
                let currentReport = reports.reports.find(report2 => report2.reportId == report.reportId)
                if (currentReport) {
                    sameReport = currentReport
                    empresa = reports
                }
            })
            console.log(sameReport, empresa)
            if (report.conversa?.length != sameReport?.conversa.length) {
                let empresa = allReports.find(report1 => report1.reports.find(report2 => report2.reportId == report.reportId))
                //updateReport()
            }
        }

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


    const getAllReportLists = async () => {
        if (AuthContext.currentUser?.id == '' || !AuthContext.currentUser?.id) return false
        let docRef = collection(db, DOC_PATH)
        let data = await getDocs(docRef)
            .then(res => {
                let reports: Array<{ empresa: string, reports: Array<reportType> }> = []
                res.docs.forEach(doc => {
                    let report = {
                        empresa: doc.data().name,
                        reports: doc.data().reports,
                    }
                    console.log("essa é a res: ", report)
                    reports.push(report)
                })

                setAllReports(reports)
            })
    }

    const sendReport = async () => {
        if (!newReport.conversa || !newReport.assunto) return
        let reportData = {
            usuario: AuthContext.currentUser.userName,
            /* @ts-ignore */
            numero: reportList.length > 1 ? reportList.map(report => report.numero).sort((a, b) => a - b).at(-1) + 1 : 1,
            reportId: Date.now().toString()
        }
        if (reportList.filter(report => report.status != "Concluída").find(existentReport => existentReport.assunto.toLocaleLowerCase() == newReport.assunto.toLocaleLowerCase())) return window.alert("Esse assunto já está sendo tratado.")

        await updateDoc(doc(db, DOC_PATH, AuthContext.currentUser.id), {
            reports: arrayUnion({ ...newReport, ...reportData })
        })
        clear()
        getReportList()
    }

    const updateReport = async (newReport = report, id = AuthContext.currentUser.id) => {
        await updateDoc(doc(db, DOC_PATH, AuthContext.currentUser.id), {
            reports: [...reportList.filter(diferentReports => diferentReports.reportId != newReport.reportId), newReport]
        })
        getReportList()
    }

    const setCurrentReport = (id: string) => {
        let report
        if (AuthContext.currentUser.userType != "Desenvolvedor") {
            report = reportList.find(report => report.reportId == id)
        } else {
            allReports.forEach(reports => {
                let currentReport = reports.reports.find(report2 => report2.reportId == id)
                if (currentReport) report = currentReport
            })
        }
        console.log("here", report)
        console.log("id", id)
        if (!report) return
        setReport(report)
        setModalState("reportDetails")
    }

    const setDone = async () => {
        const newState = { status: "Concluída" }
        updateReport({ ...report, ...newState })
            .then(res =>
                clear())
    }

    const clear = () => {
        setNewReport(initialReportState)
        setModalState("reportList")
        setReport({} as reportType)
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
                    <NewReport newReport={newReport} setNewReport={setNewReport} username={AuthContext.currentUser.userName} />
                }

                {(modalState == "reportList" && AuthContext.currentUser.userType != "Desenvolvedor") &&
                    <ReportList reportList={reportList} setCurrentReport={setCurrentReport} />
                }

                {(modalState == "reportList" && AuthContext.currentUser.userType == "Desenvolvedor") &&
                    allReports.filter(report => report.empresa != AuthContext.currentUser.workplaceName).map(report => {
                        return (
                            <>
                                <p>{report.empresa}</p>
                                <ReportList reportList={report.reports} setCurrentReport={setCurrentReport} />
                            </>
                        )
                    })
                }

                {modalState == "reportDetails" &&
                    <ReportDetais report={report} setReport={setReport} />
                }
            </Modal.Body>
            <Modal.Footer>
                {modalState != "reportList" && <Button text="Voltar" className="report-problem-button" onClick={() => setModalState("reportList")} />}
                {modalState == "newReport" && <Button text="Enviar" className="is-info" style={{ "color": "#4a4a4a !important" }} onClick={sendReport} />}
                {modalState == "reportList" && <Button text="+ Chamado" className="is-info" style={{ "color": "#4a4a4a !important" }} onClick={() => setModalState("newReport")} />}
                {modalState == "reportDetails" && <Button text="Concluir" className="is-info" style={{ "color": "#4a4a4a !important" }} onClick={setDone} />}
            </Modal.Footer>
        </Modal>
    )
}