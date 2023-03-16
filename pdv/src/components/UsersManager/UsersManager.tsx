import { Modal, Col, Spacer, Button, Text } from '@nextui-org/react'
import React from 'react'

export const UsersManager = (props :any) => {
    
    return(
        <div>
      <Modal
        aria-labelledby="modal-title"
        open={props.visible}
        onClose={() => props.closeUsersHandler()} 
        className={document.querySelector('.main')?.classList.contains('darkThemed') ? "dark-theme-modal" : ""}
      >
        <Modal.Header>
          <Col>
            <Text id="modal-title" size={18} transform="full-width">
              Gerenciador de Usuários
            </Text>
            <Spacer y={0.5} />
            
          </Col>
        </Modal.Header>
        <Modal.Footer>
          
        </Modal.Footer>
      </Modal>
    </div>
    )
}