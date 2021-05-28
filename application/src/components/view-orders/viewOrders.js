import React, { Component } from "react";
import { Template } from "../../components";
import { SERVER_IP } from "../../private";
import "./viewOrders.css";

const EDIT_ORDER_URL = `${SERVER_IP}/api/edit-order`;
const DELETE_ORDER_URL = `${SERVER_IP}/api/delete-order`;

class ViewOrders extends Component {
  state = {
    orders: [],
  };

  componentDidMount() {
    fetch(`${SERVER_IP}/api/current-orders`)
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          this.setState({ orders: response.orders });
        } else {
          console.log("Error getting orders");
        }
      });
  }

  deleteOrder(orderId) {
    fetch(DELETE_ORDER_URL, {
      method: "POST",
      body: JSON.stringify({
        id: orderId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        let orders = this.state.orders.filter((order) => order._id !== orderId);
        this.setState({ orders });
      })
      .catch((error) => console.error(error));
  }

  editOrder(orderId) {
    fetch(EDIT_ORDER_URL, {
      method: "POST",
      body: JSON.stringify({
        id: orderId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        this.props.history.push(`/order/${orderId}`);
      })
      .catch((error) => console.error(error));
  }

  render() {
    return (
      <Template>
        <div className="container-fluid">
          {this.state.orders.map((order) => {
            const createdDate = new Date(order.createdAt);
            return (
              <div className="row view-order-container" key={order._id}>
                <div className="col-md-4 view-order-left-col p-3">
                  <h2>{order.order_item}</h2>
                  <p>Ordered by: {order.ordered_by || ""}</p>
                </div>
                <div className="col-md-4 d-flex view-order-middle-col">
                  <p>
                    Order placed at{" "}
                    {`${createdDate.getHours()}:${createdDate.getMinutes()}:${createdDate.getSeconds()}`}
                  </p>
                  <p>Quantity: {order.quantity}</p>
                </div>
                <div className="col-md-4 view-order-right-col">
                  <button
                    className="btn btn-success"
                    onClick={() => this.editOrder(order._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    value={this.state.order}
                    onClick={() => this.deleteOrder(order._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Template>
    );
  }
}

export default ViewOrders;
