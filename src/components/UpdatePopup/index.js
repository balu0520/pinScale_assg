import { useEffect,useState } from 'react'
import './index.css'
import Popup from 'reactjs-popup'
import { VscEdit } from 'react-icons/vsc'
import axios from 'axios'

const overlayStyle = { background: 'rgba(0,0,0,0.5)' };

const UpdatePopup = props => {
    const { transaction } = props
    const dateString = transaction.date;
    const dateObject = new Date(dateString);
    const day = String(dateObject.getDate()).padStart(2, "0");
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const year = dateObject.getFullYear();
    const formattedDate = `${day}-${month}-${year}`
    const [transactionName, setTransactionName] = useState(transaction.transaction_name)
    const [transactionType, setTransactionType] = useState(transaction.type)
    const [transactionCategory, setTransactionCategory] = useState(transaction.category)
    const [transactionAmount, setTransactionAmount] = useState(transaction.amount)
    const [transactionDate, setTransactionDate] = useState(formattedDate)
    const [err, setErr] = useState(false)
    console.log(transactionDate)
    const [errMsg, setErrMsg] = useState("")

    useEffect(() => {
        setTransactionDate(formattedDate);
      }, [transaction.date]);
    

    const updateTransaction = event => {
        event.preventDefault();
        if (transactionName === "") {
            setErr(true)
            setErrMsg("Enter transaction Name")
            return
        } else if (transactionAmount === "") {
            setErr(true)
            setErrMsg("Enter transaction Amount")
            return
        } else if (transactionDate === "") {
            setErr(true)
            setErrMsg("Enter transaction Date")
            return
        }
        const url = "https://bursting-gelding-24.hasura.app/api/rest/update-transaction"
        const params = {
            "name": transactionName,
            "type": transactionType,
            "category": transactionCategory,
            "amount": transactionAmount,
            "date": transactionDate,
        }
        axios.post(url, {
            params: params,
            headers: {
                'content-type': 'application/json',
                'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
                'x-hasura-role': 'user',
                'x-hasura-user-id': 1
            },
        }).then(response => {
            if (response.status === 200) {
                console.log(response)
                setErr(false)
                setErrMsg("")
            } else {
                alert('Something went wrong, please try again later')
                setErr(false)
                setErrMsg("")
            }
        }).catch(error => {
            console.error('Error:', error);
        });
    }

    return (
        <Popup trigger={<button className='btn' style={{ color: "#2D60FF" }}><VscEdit /></button>} position="center" {...{ overlayStyle }} modal>
            {close => (
                <form className="update-add-modal" onSubmit={updateTransaction}>
                    <div className="update-add-modal-container">
                        <div className="update-add-modal-description-container">
                            <h1 className="update-add-modal-description-heading">Update Transaction</h1>
                            <p className="update-add-modal-description-para">You can update your transaction</p>
                        </div>
                        <button className="into-btn" onClick={() => close()}>X</button>
                    </div>
                    <div className="update-input-container">
                        <label htmlFor="transactionName" className="update-transaction-label">Transaction name</label>
                        <input type="text" id="transactionName" value={transactionName} className="update-input-label" placeholder="Enter Name" onChange={(event) => setTransactionName(event.target.value)} />
                    </div>
                    <div className="update-input-container">
                        <label htmlFor="transactionType" className="update-transaction-label">Transaction Type</label>
                        <select value={transactionType} onChange={(event) => setTransactionType(event.target.value)} id="transactionType" className="update-input-label">
                            <option value="credit">Credit</option>
                            <option value="debit">Debit</option>
                        </select>
                    </div>
                    <div className="update-input-container">
                        <label htmlFor="transactionCategory" className="update-transaction-label">Category</label>
                        <select value={transactionCategory} onChange={(event) => setTransactionCategory(event.target.value)} id="transactionCategory" className="update-input-label">
                            <option value={transactionCategory}>{transactionCategory}</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Dining">Dinning</option>
                            <option value="transfer">Transfer</option>
                            <option value="work">Work</option>
                            <option value="food">Food</option>
                            <option value="service">Service</option>
                        </select>
                    </div>
                    <div className="update-input-container">
                        <label htmlFor="transactionAmount" className="update-transaction-label">Amount</label>
                        <input type="number" id="transactionAmount" value={transactionAmount} className="update-input-label" placeholder="Enter Your Amount" onChange={(event) => setTransactionAmount(event.target.value)} />
                    </div>
                    <div className="update-input-container">
                        <label htmlFor="transactionDate" className="update-transaction-label">Date</label>
                        <input type="date" id="transactionDate" value={transactionDate} className="update-input-label" placeholder="Select date" onChange={(event) => setTransactionDate(event.target.value)} />
                    </div>
                    <button className="update-add-transaction-btn" type="submit">Add Transaction</button>
                    {err && (<p className="err-msg">{errMsg}</p>)}
                </form>
            )}
        </Popup>
    )

}

export default UpdatePopup