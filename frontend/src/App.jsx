import "./App.css";

import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const API = "http://localhost:8000";

  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [product, setProduct] = useState({
    name: "",
    sku: "",
    price: "",
    stock: "",
  });

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
  });

  const [order, setOrder] = useState({
    customer_id: "",
    product_id: "",
    quantity: "",
  });

  const loadData = async () => {
    setLoading(true);

    try {
      const p = await axios.get(`${API}/products`);
      const c = await axios.get(`${API}/customers`);
      const o = await axios.get(`${API}/orders`);

      setProducts(p.data);
      setCustomers(c.data);
      setOrders(o.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addProduct = async () => {
    try {
      if (!product.name || !product.sku || !product.price || !product.stock) {
        alert("Fill all fields");

        return;
      }
      await axios.post(`${API}/products`, {
        ...product,

        price: Number(product.price),
        stock: Number(product.stock),
      });

      setProduct({
        name: "",
        sku: "",
        price: "",
        stock: "",
      });

      loadData();
    } catch (err) {
      alert(err.response?.data?.detail || "Unable to add product");
    }
  };

  const addCustomer = async () => {
    try {
      if (!customer.name || !customer.email) {
        alert("Fill all fields");

        return;
      }

      await axios.post(`${API}/customers`, customer);

      setCustomer({
        name: "",
        email: "",
      });

      loadData();
    } catch (err) {
      alert(err.response?.data?.detail || "Unable to add customer");
    }
  };

  const addOrder = async () => {
    try {
      if (!order.customer_id || !order.product_id || !order.quantity) {
        alert("Fill all fields");

        return;
      }

      const selectedProduct = products.find((p) => p.id == order.product_id);

      if (selectedProduct.stock < Number(order.quantity)) {
        alert("Not enough stock");

        return;
      }

      await axios.post(
        `${API}/orders`,

        {
          ...order,

          customer_id: Number(order.customer_id),

          product_id: Number(order.product_id),

          quantity: Number(order.quantity),
        },
      );

      setOrder({
        customer_id: "",

        product_id: "",

        quantity: "",
      });

      loadData();
    } catch (err) {
      alert(err.response?.data?.detail || "Unable to create order");
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API}/products/${id}`);

      loadData();
    } catch {
      alert("Cannot delete");
    }
  };

  const updateProduct = async () => {
    try {
      await axios.put(
        `${API}/products/${editingId}`,

        {
          ...product,

          price: Number(product.price),

          stock: Number(product.stock),
        },
      );

      setEditingId(null);

      setProduct({
        name: "",
        sku: "",
        price: "",
        stock: "",
      });

      loadData();
    } catch {
      alert("Update Failed");
    }
  };

  const deleteCustomer = async (id) => {
    await axios.delete(`${API}/customers/${id}`);

    loadData();
  };

  if (loading) {
    return <div className="loading">Loading Inventory...</div>;
  }

  return (
    <div className="container">
      <h1 className="title">Inventory System</h1>

      <div className="stats">
        <div className="statBox">
          <h3>Low Stock Items</h3>

          <h1>{products.filter((p) => p.stock <= 10).length}</h1>
        </div>

        <div className="statBox">
          <h3>Total Customers</h3>

          <p>{customers.length}</p>
        </div>

        <div className="statBox">
          <h3>Total Revenue</h3>

          <h1>
            ₹
            {orders
              .reduce(
                (sum, o) => {
                  const product = products.find((p) => p.id === o.product_id);

                  return sum + (product ? product.price * o.quantity : 0);
                },

                0,
              )
              .toLocaleString()}
          </h1>
        </div>
      </div>

      {/* PRODUCTS */}

      <div className="section">
        <h2>Products</h2>

        <div className="inputs">
          <input
            placeholder="Name"
            value={product.name}
            onChange={(e) =>
              setProduct({
                ...product,
                name: e.target.value,
              })
            }
          />

          <input
            placeholder="SKU"
            value={product.sku}
            onChange={(e) =>
              setProduct({
                ...product,
                sku: e.target.value,
              })
            }
          />

          <input
            placeholder="Price"
            value={product.price}
            onChange={(e) =>
              setProduct({
                ...product,
                price: e.target.value,
              })
            }
          />

          <input
            placeholder="Stock"
            value={product.stock}
            onChange={(e) =>
              setProduct({
                ...product,
                stock: e.target.value,
              })
            }
          />

          <input
            placeholder="Search Products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",

              padding: "12px",

              marginBottom: "20px",
            }}
          />

          <button onClick={editingId ? updateProduct : addProduct}>
            {editingId ? "Update Product" : "Add Product"}
          </button>
        </div>

        <ul>
          {products

            .filter((p) => {
              const s = search.toLowerCase();

              return (
                p.name

                  .toLowerCase()

                  .includes(s) ||
                p.sku

                  .toLowerCase()

                  .includes(s)
              );
            })

            .map((p) => (
              <li key={p.id} className="card">
                <div
                  style={{
                    display: "flex",

                    justifyContent: "space-between",

                    alignItems: "center",
                  }}
                >
                  <strong>
                    #{p.id} • {p.name}
                  </strong>
                  <br />
                  <div className="productInfo">
                    <div>SKU : {p.sku}</div>

                    <div>Price : ₹{p.price}</div>

                    <div
                      style={{
                        color: p.stock < 5 ? "red" : "#7CFC7C",
                      }}
                    >
                      Stock : {p.stock}
                    </div>
                  </div>
                  {p.stock <= 5 && <div>⚠ Low Stock</div>}
                  <div>
                    <button
                      style={{
                        marginRight: "10px",

                        background: "orange",
                      }}
                      onClick={() => {
                        setEditingId(p.id);

                        setProduct({
                          name: p.name,

                          sku: p.sku,

                          price: p.price,

                          stock: p.stock,
                        });
                      }}
                    >
                      Edit
                    </button>

                    <button
                      style={{
                        background: "red",
                      }}
                      onClick={() => deleteProduct(p.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </div>

      {/* CUSTOMERS */}

      <div className="section">
        <h2>Customers</h2>

        <div className="inputs">
          <input
            placeholder="Customer Name"
            value={customer.name}
            onChange={(e) =>
              setCustomer({
                ...customer,
                name: e.target.value,
              })
            }
          />

          <input
            placeholder="Email"
            value={customer.email}
            onChange={(e) =>
              setCustomer({
                ...customer,
                email: e.target.value,
              })
            }
          />

          <button onClick={addCustomer}>Add Customer</button>
        </div>

        <ul>
          {customers.map((c) => (
            <li className="card" key={c.id}>
              <div>
                <h3>#{c.id}</h3>

                <p>{c.name}</p>

                <p>{c.email}</p>
              </div>

              <button
                className="deleteBtn"
                onClick={() => deleteCustomer(c.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* ORDERS */}

      <div className="section">
        <h2>Orders</h2>

        <div className="inputs">
          <select
            value={order.customer_id}
            onChange={(e) =>
              setOrder({
                ...order,

                customer_id: e.target.value,
              })
            }
          >
            <option>Customer</option>

            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={order.product_id}
            onChange={(e) =>
              setOrder({
                ...order,

                product_id: e.target.value,
              })
            }
          >
            <option>Product</option>

            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <input
            placeholder="Quantity"
            value={order.quantity}
            onChange={(e) =>
              setOrder({
                ...order,
                quantity: e.target.value,
              })
            }
          />

          <button
            onClick={addOrder}
            disabled={products.length === 0 || customers.length === 0}
          >
            Create Order
          </button>
        </div>

        <ul>
          {orders.map((o) => (
            <li key={o.id} className="card">
              Order #{o.id}
              <br />
              Customer :{customers.find((c) => c.id === o.customer_id)?.name}
              <br />
              Product :{products.find((p) => p.id === o.product_id)?.name}
              <br />
              Quantity : {o.quantity}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  <footer className="footer">
    Inventory Management System Built Using React + FastAPI
  </footer>;
}

export default App;
