import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import './index.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Sidebar from '../Sidebar'
import AdminDashboard from '../AdminDashboard'
import { BallTriangle } from 'react-loader-spinner'
import DeletePopup from '../DeletePopup'
import AddPopup from '../AddPopup'
import UpdatePopup from '../UpdatePopup'

const apiStatusConstants = {
    initial: "INITIAL",
    success: "SUCCESS",
    failure: "FAILURE",
    inProgress: "IN_PROGRESS"
}


const UserDashboard = () => {
    const [cookie, setCookies] = useCookies(["user_id"])
    const [transactions, setTransaction] = useState([])
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
    // const [load, setLoad] = useState(false)
    const [totalCredit, setTotalCredit] = useState("");
    const [totalDebit, setTotalDebit] = useState("")
    const navigate = useNavigate()

    // useEffect(() => {
    //     if (!cookie.user_id) {
    //         navigate("/login")
    //     } else {
    //         setLoad(true)
    //     }
    // }, [cookie.user_id])

    useEffect(() => {
        fetchTransactions();
        fetchAllDebitAndCredit()
    }, [])

    const getCreditDebit = totalCreditDebitTransactions => {
        let newTotalCredit = 0;
        let newTotalDebit = 0;
        for(let item of totalCreditDebitTransactions){
            if(item.type.toLowerCase() === "credit"){
                newTotalCredit += item.sum;
            }
            if(item.type.toLowerCase() === "debit"){
                newTotalDebit += item.sum;
            }
        }
        return ({totalCredit:newTotalCredit,totalDebit:newTotalDebit})
    }

    const fetchAllDebitAndCredit = () => {
        const url = "https://bursting-gelding-24.hasura.app/api/rest/credit-debit-totals"
        axios.get(url, {
            headers: {
                'content-type': 'application/json',
                'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
                'x-hasura-role': 'user',
                'x-hasura-user-id': 1
            },
        }).then(response => {
            if (response.status === 200) {
                const totalCreditDebitTransactions = response.data.totals_credit_debit_transactions;
                const {totalCredit,totalDebit} = getCreditDebit(totalCreditDebitTransactions)
                setTotalCredit(totalCredit)
                setTotalDebit(totalDebit)
            } else {
                setApiStatus(apiStatusConstants.failure)
            }
        }).catch(error => {
            console.error('Error:', error);
        });
    }

    const fetchTransactions = () => {
        setApiStatus(apiStatusConstants.inProgress)
        const url = "https://bursting-gelding-24.hasura.app/api/rest/all-transactions"
        const params = {
            limit: 3,
            offset: 0
        }
        axios.get(url, {
            params: params,
            headers: {
                'content-type': 'application/json',
                'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
                'x-hasura-role': 'user',
                'x-hasura-user-id': 1
            },
        }).then(response => {
            if (response.status === 200) {
                // console.log(response.data.transactions)
                const newTransactions = response.data.transactions;
                newTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
                setTransaction(newTransactions)
                setApiStatus(apiStatusConstants.success)
            } else {
                setApiStatus(apiStatusConstants.failure)
            }
        }).catch(error => {
            console.error('Error:', error);
        });
    }

    const onClickLogout = () => {
        setCookies("access_token", "");
        navigate("/login")
    }

    const renderTransactionsLoadingView = () => (
        <div className='loader-container'>
            <BallTriangle
                height={100}
                width={100}
                radius={5}
                color="#2D60FF"
                ariaLabel="ball-triangle-loading"
                wrapperClass={{}}
                wrapperStyle=""
                visible={true}
            />
        </div>
    )

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {
            day: 'numeric',
            month: 'short',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        };

        return date.toLocaleString('en-US', options);
    }

    const deleteTransaction = id => {
        const url = "https://bursting-gelding-24.hasura.app/api/rest/delete-transaction"
        const params = {
            "id": id
        }
        axios.delete(url, {
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
                fetchTransactions();
            } else {
                alert('Something went wrong, please try again later')
            }
        }).catch(error => {
            console.error('Error:', error);
        });
    }

    const renderTransactionSuccessView = () => {
        const len = transactions.length;
        // console.log(transactions)
        return (
            <ul className='transactions-list'>
                {transactions.map((transaction, ind) => (
                    <li key={transaction.id}>
                        <div className='transaction-item'>
                            <div className='transaction-name-container'>
                                {transaction.type === "credit" && (<img src='https://res.cloudinary.com/daz94wyq4/image/upload/v1690724471/creditted_jcivrd.png' alt='creditted' />)}
                                {transaction.type === "debit" && (<img src='https://res.cloudinary.com/daz94wyq4/image/upload/v1690724471/debitted_smwzwr.png' alt='debitted' />)}
                                <h1 className='transaction-name'>{transaction.transaction_name}</h1>
                            </div>
                            <p className='transaction-category'>{transaction.category}</p>
                            <p className='transaction-date'>{formatDate(transaction.date)}</p>
                            <p className={`transaction-amount ${transaction.type === "credit" ? 'credit' : 'debit'}`}>{`${transaction.type === "credit" ? '+' : '-'}$${transaction.amount}`}</p>
                            <div className='update-delete-container'>
                                {/* <button className='btn' style={{ color: "#2D60FF" }}><VscEdit /></button> */}
                                <UpdatePopup transaction={transaction} />
                                <DeletePopup transaction={transaction} deleteTransaction={deleteTransaction} />
                            </div>
                        </div>
                        {ind !== len - 1 && (<hr className='separator' />)}
                    </li>
                ))}
            </ul>
        )
    }

    const renderTransactionsFailureView = () => (
        <div>
            <h1>Something Went Wrong</h1>
        </div>
    )



    const renderTransactions = () => {
        switch (apiStatus) {
            case apiStatusConstants.success:
                return renderTransactionSuccessView();
            case apiStatusConstants.failure:
                return renderTransactionsFailureView();
            case apiStatusConstants.inProgress:
                return renderTransactionsLoadingView();
            default:
                return null
        }
    }

    if (cookie.user_id === 3) {
        return <AdminDashboard />
    }

    return (
        <div className='container'>
            <Sidebar activeId={0} onClickLogout={onClickLogout} />
            <div className='dashboard-container'>
                <div className='header-container'>
                    <h1 className='heading'>Account</h1>
                    <AddPopup />
                </div>
                <div className='dashboard-sub-container'>
                    <div className='type-container'>
                        <div className='credit-debit-container'>
                            <div>
                                <h1 className='credit-heading'>${totalCredit}</h1>
                                <p className='credit-para'>credit</p>
                            </div>
                            <img src='https://res.cloudinary.com/daz94wyq4/image/upload/v1690714183/credit_jbbub1.png' className='type-img' alt='credit' />
                        </div>
                        <div className='credit-debit-container'>
                            <div>
                                <h1 className='debit-heading'>${totalDebit}</h1>
                                <p className='debit-para'>Debit</p>
                            </div>
                            <img src='https://res.cloudinary.com/daz94wyq4/image/upload/v1690714183/Debit_hh7uxj.png' className='type-img' alt='debit' />
                        </div>
                    </div>
                    <h1 className='last-transaction-heading'>Last Transaction</h1>
                    {renderTransactions()}
                    <h1 className='last-transaction-heading'>Debit & Credit Overview</h1>
                    <div className='overview-container'>
                        <div className='overview-sub-container'>
                            <h1 className='overview-heading'>$7,560 Debited & $5,420 Credited in this Week</h1>
                            <div className='overview-sub-container-1'>
                                <div className=''>
                                    <button></button>
                                    <p>Debit</p>
                                </div>
                                <div>
                                    <button></button>
                                    <p>Credit</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default UserDashboard