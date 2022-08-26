import React, { useEffect, useState } from 'react';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

function History() {
  const [transaction, setTransaction] = useState([]);

  useEffect(() => {
    const MyAlert = withReactContent(Swal);
    const getAllTransaction = 'http://localhost:8080/transactions';
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
    })
      .catch((err) => {
        MyAlert.fire({
          title: <strong>Error</strong>,
          html: <i>{JSON.parse(err.message).message}</i>,
          icon: 'error',
        }).then();
      });
  }, []);

  return (
    <div>
      {
        transaction.map((t) => (
          <div className="row border my-1">
            <p className="col">{t.id}</p>
            <p className="col">{t.total}</p>
            <p className="col">{t.status}</p>
            <p className="col">
              {
              t.course_name.map((course) => (
                <p className="row">{course}</p>
              ))
            }
            </p>
            <p className="col">{t.invoice_date.split('T')[0]}</p>
          </div>
        ))
      }
    </div>
  );
}

export default History;
