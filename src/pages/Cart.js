import React, { useEffect, useState } from 'react';

function Cart(props) {
  const { cart, setCart } = props;
  const [total, setTotal] = useState(0);
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  });

  useEffect(() => {
    let temp = 0;
    for (const cartElement of cart) {
      temp += cartElement.price;
    }
    setTotal(temp);
  }, [cart]);

  const removeCourse = (id) => {
    setCart(cart.filter((obj) => obj.id !== id));
  };
  return (
    <div>
      {
        cart.length === 0 ? (
          <h3 className="text-muted">Cart Is Empty</h3>
        ) : (
          <>
            <h2>Cart</h2>
            {' '}
            {
            cart.map((c) => (
              <div className="row my-3">
                <div className="col-1 d-flex justify-content-center align-items-center">
                  <button type="button" className="btn btn-danger" onClick={() => removeCourse(c.id)}>X</button>
                </div>
                <div style={{ width: '20%' }}>
                  <img src={c.img_url} className="col" width="100%" />
                </div>
                <div className="col text-start">
                  <h3>{c.name}</h3>
                  <p>{c.authorName}</p>
                </div>
                <div className="col d-flex justify-content-center align-items-center">
                  <h3>{formatter.format(c.price)}</h3>
                </div>
              </div>
            ))
            }
            <h3 style={{ textAlign: 'end', verticalAlign: 'bottom' }}>
              Total =
              {' '}
              {total}
            </h3>
          </>
        )
      }
    </div>
  );
}

export default Cart;
