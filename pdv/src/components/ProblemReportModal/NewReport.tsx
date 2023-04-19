import React from 'react'
import { reportType, conversationType } from '../../types/reportProblemTypes'
import { currentDate, currentTime } from '../../utils/consts'

interface propsType {
    newReport: reportType,
    setNewReport: React.Dispatch<React.SetStateAction<reportType>>,
    username: string
}

export const NewReport = (props :propsType) => {

    return (
        <>
        <div className="report-problem-input-div">
            <input
                type="text"
                className="report-problem-input"
                id="reportProblemInput"
                autoComplete='off'
                onChange={(e) => {
                    let newData = { assunto: e.target.value }
                    props.setNewReport({ ...props.newReport, ...newData })
                }}
                value={props.newReport.assunto}
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
                        usuario: props.username,
                        data: currentDate,
                        hora: currentTime,
                        texto: e.target.value
                    }]}
                    props.setNewReport({ ...props.newReport, ...newData })
                }}
                value={props.newReport.conversa[0]?.texto}
                name="report-problem-input"
                required
            />
        </div>
    </>
    )
}