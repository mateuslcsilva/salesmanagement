
export interface conversationType {
    usuario: string,
    texto: string
    data: string,
    hora: string
}

export interface reportType {
    assunto: string,
    conversa: Array<conversationType>,
    data: string,
    hora: string,
    usuario: string,
    numero: number,
    status: string,
    reportId: string
}