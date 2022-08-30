import React, { useEffect, useState } from 'react';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import environment from '../utils/environment';
import { API_ADMIN_GIFTS, API_FAVOURITES } from '../constants/ApiConstants';

function AdminGift(props) {
  const MyAlert = withReactContent(Swal);
  const [gift, setGift] = useState([]);
  const [stock, setStock] = useState('');
  const [updateGift, setUpdateGift] = useState({
    ID: 0,
    Item: '',
    Stock: 0,
  });
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    const getAllGift = `${environment.baseRootApi}${API_ADMIN_GIFTS}`;
    fetch(getAllGift, {
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
      setGift(data.data);
    })
      .catch((err) => {
        MyAlert.fire({
          title: <strong>Error</strong>,
          html: <i>{JSON.parse(err.message).message}</i>,
          icon: 'error',
        }).then();
      });
  }, [update]);

  const handleClick = (gft) => {
    setUpdateGift(gft);
    setUpdate(true);
  };

  const updateStockClick = () => {
    const patchGiftStock = `${environment.baseRootApi}${API_ADMIN_GIFTS}/${updateGift.ID}`;
    const updateObj = {
      stock: parseInt(stock, 10),
    };
    fetch(patchGiftStock, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(updateObj),
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

  const stockChange = (event) => {
    setStock(event.target.value);
  };
  return (
    <div className="container mt-5">
      {
        update && (
          <div className="mb-3 row">
            <p className="col-sm-2 col-lg-4 col-form-label">{updateGift.Item}</p>
            <div className="col-sm-10">
              <div className="row">
                <label htmlFor="inputStock" className="col-sm-2 col-lg-6">
                  <input type="text" className="form-control" id="inputStock" name="stock" placeholder={updateGift.Stock} onChange={stockChange} value={stock} />
                </label>
                <button type="button" className="btn btn-success col-4" onClick={updateStockClick}>Update Stock</button>
              </div>
            </div>
          </div>
        )
      }
      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th scope="col">No</th>
            <th scope="col">Item</th>
            <th scope="col">Stock</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {
          gift && (
            gift.map((g, index) => (
              <tr key={g.ID}>
                <td>{index + 1}</td>
                <td>{g.Item}</td>
                <td>{g.Stock}</td>
                <td>
                  <button type="button" className="btn btn-success" onClick={() => handleClick(g)}>UPDATE</button>
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

export default AdminGift;
