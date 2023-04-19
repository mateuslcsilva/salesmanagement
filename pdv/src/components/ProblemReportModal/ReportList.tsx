import React from 'react'
import { reportType, conversationType } from '../../types/reportProblemTypes'
import { currentDate, currentTime } from '../../utils/consts'

interface propsType {
    reportList: Array<reportType>,
    setCurrentReport: (id:string) => void,
}

export const ReportList = (props :propsType) => {

    return(
        <>
        <div className='report-list-helper'>
            <p>Número</p>
            <p>Assunto</p>
            <p>Status</p>
        </div>
        {props.reportList.filter(report => report.status != "Concluída").map(report => {
            return (
                <div className='report-list-div'>
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