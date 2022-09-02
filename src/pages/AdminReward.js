import React, { useEffect, useState } from 'react';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import moment from 'moment';
import environment from '../utils/environment';
import { API_ADMIN_ALL_DELIVERY_GIFTS } from '../constants/ApiConstants';

function AdminReward(props) {
  const MyAlert = withReactContent(Swal);
  const [update, setUpdate] = useState(false);
  const [statusDelivery, setStatusDelivery] = useState('');
  const [deliveryGift, setDeliveryGift] = useState([]);
  const [updateDeliveryGift, setUpdateDeliveryGift] = useState({
    id: 0,
    user_name: '',
    gift_name: '',
    status: '',
    date_estimated: '',
  });

  useEffect(() => {
    const getAllDeliveryGift = `${environment.baseRootApi}${API_ADMIN_ALL_DELIVERY_GIFTS}`;
    fetch(getAllDeliveryGift, {
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
      setDeliveryGift(data.data);
    })
      .catch((err) => {
        MyAlert.fire({
          title: <strong>Error</strong>,
          html: <i>{JSON.parse(err.message).message}</i>,
          icon: 'error',
        }).then();
      });
  }, [update]);

  const updateStatusDelivery = () => {
    const patchGiftStock = `${environment.baseRootApi}${API_ADMIN_ALL_DELIVERY_GIFTS}/${updateDeliveryGift.id}`;
    const updateDeliveryObj = {
      status: statusDelivery,
    };
    fetch(patchGiftStock, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(updateDeliveryObj),
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

  const handleClick = (gft) => {
    setUpdateDeliveryGift(gft);
    setUpdate(true);
  };

  const statusChange = (event) => {
    setStatusDelivery(event.target.value);
  };

  return (
    <div className="container mt-5">
      {
        update && (
          <div className="mb-3 row">
            <p className="col-sm-2 col-lg-4 col-form-label">Update Delivery Status</p>
            <div className="col-sm-10">
              <div className="row">
                <label htmlFor="inputStock" className="col-sm-2 col-lg-6">
                  <input type="text" className="form-control" id="inputStock" name="statusDelivery" placeholder={updateDeliveryGift.status} onChange={statusChange} value={statusDelivery} />
                </label>
                <button type="button" className="btn btn-success col-4" onClick={updateStatusDelivery}>Update Status</button>
              </div>
            </div>
          </div>
        )
      }
      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th scope="col">No</th>
            <th scope="col">User</th>
            <th scope="col">Gift</th>
            <th scope="col">Status</th>
            <th scope="col">Date Estimate</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {
          deliveryGift && (
            deliveryGift.map((gft, index) => (
              <tr key={gft.id}>
                <td>{index + 1}</td>
                <td>{gft.user_name}</td>
                <td>{gft.gift_name}</td>
                <td>{gft.status}</td>
                <td>{moment(gft.date_estimated).format('llll')}</td>
                <td>
                  {
                    gft.status === 'ONGOING' && (
                      <button type="button" className="btn btn-success" onClick={() => handleClick(gft)}>UPDATE</button>
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

export default AdminReward;
