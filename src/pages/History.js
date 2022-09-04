import React, { useEffect, useState } from 'react';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import QRCode from 'react-qr-code';
import moment from 'moment';
import { API_TRANSACTIONS } from '../constants/ApiConstants';
import environment from '../utils/environment';
import { URL_PURCHASE } from '../constants/WebAppConstants';
import Loading from '../Components/Loading';

function History() {
  const MyAlert = withReactContent(Swal);
  const [transaction, setTransaction] = useState([]);
  const [loading, setLoading] = useState(true);
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  });

  useEffect(() => {
    const getAllTransaction = `${environment.baseRootApi}${API_TRANSACTIONS}`;
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
      setLoading(false);
    })
      .catch((err) => {
        MyAlert.fire({
          title: <strong>Error</strong>,
          html: <i>{JSON.parse(err.message).message}</i>,
          icon: 'error',
        }).then();
      });
  }, []);

  const handleClick = (id) => {
    const qrPayment = `${environment.baseWebApp}${URL_PURCHASE}${id}/${localStorage.getItem('token')}`;
    MyAlert.fire({
      title: <strong>Scan QR</strong>,
      html: <i><QRCode value={qrPayment} /></i>,
      icon: 'info',
    }).then();
  };
  return (
    <div>
      {
        loading ? (
          <Loading />
        ) : (
          <div className="table-responsive">
            <table className="table bg-white border mt-3">
              <thead className="text-white" style={{ background: '#292728' }}>
                <tr>
                  <th scope="col">No</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Status</th>
                  <th scope="col">Courses</th>
                  <th scope="col">Date</th>
                </tr>
              </thead>
              <tbody>
                {
              transaction ? (
                transaction.map((t, index) => (
                  <tr key={t.id} scope="row">
                    <th scope="row">
                      {index + 1}
                      .
                    </th>
                    <th className="col">{formatter.format(t.total)}</th>
                    {
                      t.status === 'ORDER' || t.status === 'WAITING PAYMENT' ? (
                        <th className="col">
                          <button type="button" className="btn btn-warning" onClick={() => handleClick(t.id)}>{t.status}</button>
                        </th>
                      ) : (
                        <th className="col">{t.status}</th>
                      )
                    }
                    <th className="col">
                      {
                        t.course_name.map((course) => (
                          <p className="row">{course}</p>
                        ))
                      }
                    </th>
                    <th className="col">{moment(t.invoice_date).utc().format('llll')}</th>
                  </tr>
                ))
              ) : (
                <tr className="text-muted text-center">
                  <th>
                    No Transaction
                  </th>
                </tr>
              )
          }
              </tbody>
            </table>
          </div>
        )
      }
    </div>
  );
}

export default History;
