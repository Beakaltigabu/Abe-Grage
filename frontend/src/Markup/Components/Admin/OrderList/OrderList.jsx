import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Pagination, Container, Row, Col } from 'react-bootstrap';
import { FaExternalLinkAlt, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getOrders } from '../../../../Services/order.service';
import styles from './OrderList.module.css';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ordersPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const fetchOrders = async (page) => {
    try {
      const data = await getOrders({
        page,
        limit: ordersPerPage,
        sortby: 'order_date DESC',
        completed: null // Set to 0 for completed orders, 1 for active orders, or null for all
      });
      setOrders(data.orders);
      setTotalPages(Math.ceil(data.total / ordersPerPage));
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
      setTotalPages(1);
    }
  };

  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge bg="success">Completed</Badge>;
      case 'inprogress':
        return <Badge bg="warning" text="dark">In Progress</Badge>;
      case 'received':
      default:
        return <Badge bg="secondary">Received</Badge>;
    }
  };
  const handleView = (orderId) => {
    navigate(`/orders/view/${orderId}`);
  };

  const handleEdit = (orderId) => {
    navigate(`/orders/edit/${orderId}`);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <h1 className="mb-4">Orders <span className={styles.title}>___</span></h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table striped bordered hover responsive="md" className={styles.orderTable}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Vehicle</th>
                <th>Order Date</th>
                <th>Received By</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.order_id}>
                    <td>{order.order_id}</td>
                    <td>
                      {order.customer_first_name} {order.customer_last_name}<br />
                      {order.customer_email}<br />
                      {order.customer_phone_number}
                    </td>
                    <td>
                      {order.vehicle_make} {order.vehicle_model}<br/>
                      {order.vehicle_year}
                      <div>{order.vehicle_tag}</div>
                    </td>
                    <td>{new Date(order.order_date).toLocaleDateString()}</td>
                    <td>{order.employee_first_name} {order.employee_last_name}</td>
                    <td>{getStatusBadge(order.order_status)}</td>
                    <td>
                      <Button variant="link" className={styles.actionButton} onClick={() => handleView(order.order_id)}>
                        <FaExternalLinkAlt />
                      </Button>
                      <Button variant="link" className={styles.actionButton} onClick={() => handleEdit(order.order_id)}>
                        <FaEdit />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No orders found</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex justify-content-center">
          <Pagination>
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            <Pagination.Item active>{currentPage}</Pagination.Item>
            <Pagination.Next
              onClick={() => {
                console.log('Next button clicked');
                console.log('Current page:', currentPage);
                console.log('Total pages:', totalPages);
                handlePageChange(currentPage + 1);
              }}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderList;
