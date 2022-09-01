import React, { useEffect, useState } from 'react';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import moment from 'moment/moment';
import environment from '../utils/environment';
import { API_ADMIN_ALL_TRANSACTION } from '../constants/ApiConstants';

function AdminTransaction(props) {
  const MyAlert = withReactContent(Swal);
  const [update, setUpdate] = useState(false);
  const [statusTransaction, setStatusTransaction] = useState('');
  const [transaction, setTransaction] = useState([]);
  const [filterTransaction, setFilterTransaction] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState(moment().format('YYYY-MM-DD'));
  const [filterObj, setFilterObj] = useState({
    filterDate: moment().format('YYYY-MM-DD'),
    filterStatus: '',
  });
  const [updateTransaction, setUpdateTransaction] = useState({
    id: 0,
    user_name: '',
    total: 0,
    status: '',
    invoice_date: '',
    course_name: [],
  });

  useEffect(() => {
    const getAllTransaction = `${environment.baseRootApi}${API_ADMIN_ALL_TRANSACTION}`;
    fetch(getAllTransaction, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }).then((response) => {
      if (!response.ok) {
        return response.text().then((text) => { throw new Error(text); });
      }
      return response.json();
    }).then((data) => {
      setTransaction(data.data);
      setFilterTransaction(data.data);
    })
      .catch((err) => {
        MyAlert.fire({
          title: <strong>Error</strong>,
          html: <i>{JSON.parse(err.message).message}</i>,
          icon: 'error',
        }).then();
      });
  }, [update]);

  const updateStatusTransaction = () => {
    const patchTransactionStatus = `${environment.baseRootApi}${API_ADMIN_ALL_TRANSACTION}`;
    const updateTransactionObj = {
      invoice_id: updateTransaction.id,
      status: statusTransaction,
    };
    fetch(patchTransactionStatus, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(updateTransactionObj),
    }).then((response) => {
      if (!response.ok) {
        return response.text().then((text) => { throw new Error(text); });
      }
      return response.json();
    }).then((data) => {
      MyAlert.fire({
        title: <strong>Success</strong>,
        html: <i>{data.data}</i>,
        icon: 'success',
      }).then();
    })
      .catch((err) => {
        MyAlert.fire({
          title: <strong>Error</strong>,
          html: <i>{JSON.parse(err.message).message}</i>,
          icon: 'error',
        }).then();
      });
    setUpdate(false);
  };

  const handleClick = (cr) => {
    setUpdateTransaction(cr);
    setUpdate(true);
  };

  const statusChange = (event) => {
    setStatusTransaction(event.target.value);
  };

  useEffect(() => {
    const temp = [...transaction];
    setFilterTransaction(
      temp.filter(
        (obj) => obj.status.toLowerCase().includes(filterStatus.toLowerCase()),
      )
        .filter((obj) => moment(obj.invoice_date).isAfter(moment(filterObj.filterDate).startOf('day')) && moment(obj.invoice_date).isBefore(moment(filterObj.filterDate).endOf('day'))),
    );
  }, [filterObj, transaction]);

  useEffect(() => {
    setFilterStatus(filterObj.filterStatus);
    setFilterDate(filterObj.filterDate);
  }, [filterObj]);

  const handleChange = (event) => {
    setFilterObj({
      ...filterObj,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div className="container mt-5">
      {
        update && (
          <div className="mb-3 row">
            <p className="col-sm-2 col-lg-4 col-form-label">Update Transaction Status</p>
            <div className="col-sm-10">
              <div className="row">
                <label htmlFor="inputStock" className="col-sm-2 col-lg-6">
                  <input type="text" className="form-control" id="inputStock" name="statusTransaction" placeholder={updateTransaction.status} onChange={statusChange} value={statusTransaction} />
                </label>
                <button type="button" className="btn btn-success col-4" onClick={updateStatusTransaction}>Update Status</button>
              </div>
            </div>
          </div>
        )
      }
      <div className="mx-3 row d-flex justify-content-between">
        <label htmlFor="searching" className="mx-1 col-lg-4 col-sm-2">
          <input className="form-control" id="searching" type="text" placeholder="search" name="filterStatus" onChange={handleChange} value={filterStatus} />
        </label>
        <label htmlFor="inputStock" className="col-sm-2 col-lg-4">
          <input type="date" value={filterDate} name="filterDate" onChange={handleChange} />
        </label>
      </div>
      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th scope="col">No</th>
            <th scope="col">User</th>
            <th scope="col">Total</th>
            <th scope="col">Status</th>
            <th scope="col">Date</th>
            <th scope="col">Course</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {
          transaction && (
            filterTransaction.map((tr, index) => (
              <tr key={tr.id}>
                <td>{index + 1}</td>
                <td>{tr.user_name}</td>
                <td>{tr.total}</td>
                <td>{tr.status}</td>
                <td>{moment(tr.invoice_date).utc().format('llll')}</td>
                <td>
                  {
                    tr.course_name.map((cr) => (
                      <p className="row">{cr}</p>
                    ))
                  }
                </td>
                <td>
                  {
                    (tr.status !== 'COMPLETE' && tr.status !== 'CANCELED') && (
                      <button type="button" className="btn btn-success" onClick={() => handleClick(tr)}>UPDATE</button>
                    )
                  }
                </td>
              </tr>
            ))
          )
        }
        </tbody>
      </table>
    </div>
  );
}

export default AdminTransaction;
