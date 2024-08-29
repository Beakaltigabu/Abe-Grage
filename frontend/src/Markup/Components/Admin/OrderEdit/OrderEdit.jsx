import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrder, updateOrder } from '../../../../Services/order.service';
import { Card, Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { FaEdit, FaTimes, FaPlus } from 'react-icons/fa';
import styles from './OrderEdit.module.css';

const OrderEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState({ order_services: [] });
  const [showCustomerDetails, setShowCustomerDetails] = useState(true);
  const [showVehicleDetails, setShowVehicleDetails] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrder(id);
        console.log('Fetched order data:', data);
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Failed to load order. Please try again.');
      }
    };

    fetchOrder();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder((prevOrder) => ({
      ...prevOrder,
      [name]: value
    }));
  };

  const handleServiceChange = (e) => {
    const { value, checked } = e.target;
    setOrder((prevOrder) => {
      const newServices = checked
        ? [...(prevOrder.order_services || []), { service_id: parseInt(value), service_completed: 0 }]
        : (prevOrder.order_services || []).filter((service) => service.service_id !== parseInt(value));
      return { ...prevOrder, order_services: newServices };
    });
  };


  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateOrder(id, order);
      alert('Order updated successfully');
      const updatedOrderData = await getOrder(id);
      setOrder(updatedOrderData);
      navigate('/orders');
    } catch (error) {
      console.error('Error updating order:', error);
      setError('Failed to update order. Please try again.');
    }
  };

  if (!order || Object.keys(order).length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <h1 className={styles.title}>Edit Order <span className={styles.orderId}>#{order.order_id}</span></h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className={`mb-4 ${styles.cardCustom}`}>
        <Card.Header className={styles.cardHeaderCustom}>
          <span className={styles.cardHeaderTitle}>{order.customer_first_name} {order.customer_last_name}</span>
          <Button variant="link" onClick={() => setShowCustomerDetails(!showCustomerDetails)} className={styles.buttonToggle}>
            {showCustomerDetails ? <FaTimes /> : <FaPlus />}
          </Button>
        </Card.Header>
        {showCustomerDetails && (
          <Card.Body>
            <Card.Text className={styles.cardTextKey}>Email: <span className={styles.cardTextValue}>{order.customer_email}</span></Card.Text>
            <Card.Text className={styles.cardTextKey}>Phone Number: <span className={styles.cardTextValue}>{order.customer_phone_number}</span></Card.Text>
            <Card.Text className={styles.cardTextKey}>Active Customer: <span className={styles.cardTextValue}>{order.active_customer_status ? 'Yes' : 'No'}</span></Card.Text>
          </Card.Body>
        )}
      </Card>


      <Card className={`mb-4 ${styles.cardCustom}`}>
        <Card.Header className={styles.cardHeaderCustom}>
          <span className={styles.cardHeaderTitle}>{order.vehicle_make} {order.vehicle_model}</span>
          <Button variant="link" onClick={() => setShowVehicleDetails(!showVehicleDetails)} className={styles.buttonToggle}>
            {showVehicleDetails ? <FaTimes /> : <FaPlus />}
          </Button>
        </Card.Header>
        {showVehicleDetails && (
          <Card.Body>
            <Card.Text className={styles.cardTextKey}>Vehicle Color: <span className={styles.cardTextValue}>{order.vehicle_color}</span></Card.Text>
            <Card.Text className={styles.cardTextKey}>Vehicle Tag: <span className={styles.cardTextValue}>{order.vehicle_tag}</span></Card.Text>
            <Card.Text className={styles.cardTextKey}>Vehicle Year: <span className={styles.cardTextValue}>{order.vehicle_year}</span></Card.Text>
            <Card.Text className={styles.cardTextKey}>Vehicle Mileage: <span className={styles.cardTextValue}>{order.vehicle_mileage}</span></Card.Text>
            <Card.Text className={styles.cardTextKey}>Vehicle Serial: <span className={styles.cardTextValue}>{order.vehicle_serial}</span></Card.Text>
          </Card.Body>
        )}
      </Card>


      <Form onSubmit={handleUpdate}>
        <Card className={`mb-4 ${styles.cardCustom}`}>
          <Card.Header className={styles.cardHeaderCustom}>
            <span className={styles.cardHeaderTitle}>Choose Services</span>
          </Card.Header>
          <Card.Body>
            {Array.isArray(order.services) && order.services.length > 0 ? (
              order.services.map((service) => (
                <Row key={service.service_id} className={`align-items-center mb-2 ${styles.serviceRow}`}>
                  <Col>
                    <Card.Text className={styles.serviceName}>{service.service_name}</Card.Text>
                    <Card.Text className={styles.serviceDescription}>{service.service_description}</Card.Text>
                  </Col>
                  <Col xs="auto">
                    <Form.Check
                      type="checkbox"
                      value={service.service_id}
                      onChange={handleServiceChange}
                      checked={order.order_services && order.order_services.some(s => s.service_id === service.service_id)}
                      className={styles.serviceCheckbox}
                    />
                  </Col>
                </Row>
              ))
            ) : (
              <p>No services available for this order.</p>
            )}
          </Card.Body>
        </Card>


        <Card className={`mb-4 ${styles.cardCustom}`}>
          <Card.Header className={styles.cardHeaderCustom}>
            <span className={styles.cardHeaderTitle}>Order Details<span className={styles.orderDetailsAccent}>____</span></span>
          </Card.Header>
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Label>Order Description</Form.Label>
              <Form.Control
                as="textarea"
                name="order_description"
                value={order.order_description || ''}
                onChange={handleChange}
                className={styles.formControl}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Order Status</Form.Label>
              <Form.Select
                name="order_status"
                value={order.order_status || ''}
                onChange={handleChange}
                className={styles.formControl}
              >
                <option value="received">Received</option>
                <option value="inprogress">In Progress</option>
                <option value="completed">Completed</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Total Price</Form.Label>
              <Form.Control
                type="number"
                name="order_total_price"
                value={order.order_total_price || ''}
                onChange={handleChange}
                className={styles.formControl}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Additional Request</Form.Label>
              <Form.Control
                as="textarea"
                name="additional_request"
                value={order.additional_request || ''}
                onChange={handleChange}
                className={styles.formControl}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Notes for Customer</Form.Label>
              <Form.Control
                as="textarea"
                name="notes_for_customer"
                value={order.notes_for_customer || ''}
                onChange={handleChange}
                className={styles.formControl}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Notes for Internal Use</Form.Label>
              <Form.Control
                as="textarea"
                name="notes_for_internal_use"
                value={order.notes_for_internal_use || ''}
                onChange={handleChange}
                className={styles.formControl}
              />
            </Form.Group>

            <Button type="submit" className={styles.buttonCustom}>
              Update Order
            </Button>
          </Card.Body>
        </Card>
      </Form>
    </Container>
  );
};

export default OrderEdit;
