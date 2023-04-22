export const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

let current = new Date
let currentDay = current.getDate().toString().length < 2 ? '0' + current.getDate() : current.getDate()
let currentMonth = current.getMonth().toString().length < 2 ? '0' + (current.getMonth() + 1) : (current.getMonth() + 1)
export const currentDate = currentDay + '/' + currentMonth + '/' + current.getFullYear()
export const currentTime = current.getHours() + ':' + (current.getMinutes() < 10 ? "0" + current.getMinutes() : current.getMinutes())

export const serviceTerms = `
Seja bem vindo ao Simpls Gestão de Comandas, ao concluir o cadastro, você concorda com as seguintes condições:
1) Estou ciente de que o software está em versão beta, e embora tenha sido amplamente testado em ambiente de desenvolvimento, pode apresentar problemas e alterações sem aviso prévio.
2) Todo e qualquer problema deve ser reportado ao desenvolvedor, com o máximo de detalhamento possível.
3) O prazo previsto para resolução de problemas é de 7 (sete) dias corridos a partir da data de reporte.
4) Por favor, fique à vontade para fazer sugestões de melhorias ou implementações de funcionalidades, todas elas serão analisadas, quanto à valor trazido à aplicação e viabilidade, e, caso seja identificado a necessidade e possibilidade de desenvolvimento, serão implementadas.
5) Devido aos motivos citados acima, a versão Beta desta aplicação é gratuita, não tendo nenhum custo financeiro para o cliente, enquanto a aplicação estiver em beta.
6) Usuários da versão beta terão condições especiais na liberação da versão oficial da aplicação, caso sigam todos os termos citados acima.`