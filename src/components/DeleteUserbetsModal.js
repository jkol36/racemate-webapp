import React from 'react'
import Modal from 'react-bootstrap/lib/Modal'

export const DeleteUserbetModal = (props) => {
  return (
    <Modal show={props.show} onHide={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Are you sure?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete all your bet history? This action is irreversible.
      </Modal.Body>
      <Modal.Footer>
        <button className='btn btn-success' onClick={props.onDelete}>Yes</button>
        <button className='btn btn-danger' onClick={props.onHide}>No</button>
      </Modal.Footer>
    </Modal>
  )
}
