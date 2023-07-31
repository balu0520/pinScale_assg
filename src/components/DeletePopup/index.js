import Popup from 'reactjs-popup'
import {FiAlertTriangle} from 'react-icons/fi'
import { FaRegTrashAlt } from 'react-icons/fa'
import './index.css'

const overlayStyle = { background: 'rgba(0,0,0,0.5)' };

const DeletePopup = props => {
    const {transaction,deleteTransaction} = props

    const onDeleteTransaction = id => {
        deleteTransaction(id)
    }


    return (
        <Popup trigger={<button className='btn' style={{ color: "#FE5C73" }}><FaRegTrashAlt /></button>} position="center" {...{ overlayStyle }} modal>
            {close => (
                <div className='delete-modal' >
                    <div className='delete-modal-container'>
                        <div className='alert-container'>
                            <div className='alert-sub-container'>
                                <FiAlertTriangle className='alert-icon' />
                            </div>
                        </div>
                        <div className='delete-container'>
                            <h1 className='delete-heading'>Are you sure you want to Delete?</h1>
                            <p className='delete-para'>This transaction will be deleted immediately. You can’t undo this action.</p>
                            <div className='delete-btn-container'>
                                <button className='delete-btn' onClick={() => onDeleteTransaction(transaction.id)}>Yes, Delete</button>
                                <button onClick={() => close()} className='no-delete-btn'>No, Leave it</button>
                            </div>
                        </div>
                        <button className='into-btn' onClick={() => close()}>X</button>
                    </div>
                </div>
            )}
        </Popup>
    )
}

export default DeletePopup