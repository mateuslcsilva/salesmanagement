import React from 'react'
import { reportType, conversationType } from '../../types/reportProblemTypes'
import { currentDate, currentTime } from '../../utils/consts'
import { useAuthContext } from '../../utils/contexts/AuthProvider'

interface propsType {
    reportList: Array<reportType>,
    setCurrentReport: (id:string) => void,
}

export const ReportList = (props :propsType) => {
    const AuthContext = useAuthContext()

    return(
        <>
        <div className='report-list-helper'>
            <p>Número</p>
            <p>Assunto</p>
            <p>Status</p>
        </div>
        {props.reportList?.filter(report => report.status != "Concluída").sort((a, b) => a.numero - b.numero).map(report => {
            return (
                <div className={`report-list-div ${report.status == "Respondido" && 'colored'} ${AuthContext.currentUser.userType == "Desenvolvedor" && report.status == "Pendente" && 'alert'}`}>
                    <p>{report.numero}</p>
                    <p><abbr title={report.assunto}>{report.assunto}</abbr></p>
                    <p>{report.status}</p>
                    <i 
                    className="bi bi-box-arrow-in-up-right"
                    onClick={() => props.setCurrentReport(report.reportId)}
                    ></i>
                </div>
            )
        })}
    </>
    )
}