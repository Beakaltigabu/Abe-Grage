import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrder } from '../../../../Services/order.service';
import { Card, Container, Row, Col, Badge, Form } from 'react-bootstrap';
import { FaUser, FaCar, FaTools, FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa';
import styles from './OrderView.module.css';

const OrderView = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        console.log('Fetching order with id:', id);
        const data = await getOrder(id);
        console.log('Fetched order data:', data);
        setOrder(data[0]); // Set the first element of the array
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    fetchOrderDetails();
  }, [id]);

  useEffect(() => {
    console.log('Order state updated:', order);
  }, [order]);

  if (!order) {
    return <div>Loading...</div>;
  }

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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
  };

  return (
    <Container>
      <h1 className={`mb-4 ${styles.title}`}>Order Details <span className={styles.orderId}>#{order.order_id}</span></h1>

      <Card className={`mb-4 ${styles.cardCustom}`}>
        <Card.Header className={styles.cardHeaderCustom}>
          <span className={styles.cardHeaderTitle}><FaUser /> Customer Information</span>
        </Card.Header>
        <Card.Body>
          <Card.Text className={styles.cardTextKey}>Name: <span className={styles.cardTextValue}>{order.customer_first_name} {order.customer_last_name}</span></Card.Text>
          <Card.Text className={styles.cardTextKey}>Email: <span className={styles.cardTextValue}>{order.customer_email}</span></Card.Text>
          <Card.Text className={styles.cardTextKey}>Phone: <span className={styles.cardTextValue}>{order.customer_phone_number}</span></Card.Text>
          <Card.Text className={styles.cardTextKey}>Active Customer: <span className={styles.cardTextValue}>{order.active_customer_status ? "Yes" : "No"}</span></Card.Text>
        </Card.Body>
      </Card>

      <Card className={`mb-4 ${styles.cardCustom}`}>
        <Card.Header className={styles.cardHeaderCustom}>
          <span className={styles.cardHeaderTitle}><FaCar /> Vehicle Information</span>
        </Card.Header>
        <Card.Body>
          <Card.Text className={styles.cardTextKey}>Make: <span className={styles.cardTextValue}>{order.vehicle_make}</span></Card.Text>
          <Card.Text className={styles.cardTextKey}>Model: <span className={styles.cardTextValue}>{order.vehicle_model}</span></Card.Text>
          <Card.Text className={styles.cardTextKey}>Year: <span className={styles.cardTextValue}>{order.vehicle_year}</span></Card.Text>
          <Card.Text className={styles.cardTextKey}>Type: <span className={styles.cardTextValue}>{order.vehicle_type}</span></Card.Text>
          <Card.Text className={styles.cardTextKey}>Color: <span className={styles.cardTextValue}>{order.vehicle_color}</span></Card.Text>
          <Card.Text className={styles.cardTextKey}>Mileage: <span className={styles.cardTextValue}>{order.vehicle_mileage}</span></Card.Text>
          <Card.Text className={styles.cardTextKey}>Tag: <span className={styles.cardTextValue}>{order.vehicle_tag}</span></Card.Text>
          <Card.Text className={styles.cardTextKey}>Serial: <span className={styles.cardTextValue}>{order.vehicle_serial}</span></Card.Text>
        </Card.Body>
      </Card>

      <Card className={`mb-4 ${styles.cardCustom}`}>
        <Card.Header className={styles.cardHeaderCustom}>
          <span className={styles.cardHeaderTitle}><FaTools /> Services</span>
        </Card.Header>
        <Card.Body>
          {Array.isArray(order.services) && order.services.length > 0 ? (
            order.services.map((service, index) => (
              <Row key={index} className={`align-items-center mb-2 ${styles.serviceRow}`}>
                <Col>
                  <Card.Text className={styles.serviceName}>{service.service_name}</Card.Text>
                  <Card.Text className={styles.serviceDescription}>{service.service_description}</Card.Text>
                </Col>
                <Col xs="auto">
                  <Form.Check
                    type="checkbox"
                    checked={service.service_completed === 1}
                    disabled
                    className={styles.serviceCheckbox}
                  />
                </Col>
              </Row>
            ))
          ) : (
            <Card.Text>No services associated with this order.</Card.Text>
          )}
        </Card.Body>
      </Card>

      <Card className={`mb-4 ${styles.cardCustom}`}>
        <Card.Header className={styles.cardHeaderCustom}>
          <span className={styles.cardHeaderTitle}>Order Details<span className={styles.orderDetailsAccent}>____</span></span>
        </Card.Header>
        <Card.Body>
          <Card.Text className={styles.cardTextKey}>Status: <span className={styles.cardTextValue}>{getStatusBadge(order.order_status)}</span></Card.Text>
          <Card.Text className={styles.cardTextKey}>Description: <span className={styles.cardTextValue}>{order.order_description}</span></Card.Text>
          <Card.Text className={styles.cardTextKey}>Total Price: <span className={styles.cardTextValue}>${order.order_total_price}</span></Card.Text>
          <Card.Text className={styles.cardTextKey}>Additional Request: <span className={styles.cardTextValue}>{order.additional_request || 'None'}</span></Card.Text>
          <Card.Text className={styles.cardTextKey}>Notes for Customer: <span className={styles.cardTextValue}>{order.notes_for_customer || 'None'}</span></Card.Text>
          <Card.Text className={styles.cardTextKey}>Notes for Internal Use: <span className={styles.cardTextValue}>{order.notes_for_internal_use || 'None'}</span></Card.Text>
        </Card.Body>
      </Card>

      <Row>
        <Col md={6}>
          <Card className={`mb-4 ${styles.cardCustom}`}>
            <Card.Header className={styles.cardHeaderCustom}>
              <span className={styles.cardHeaderTitle}><FaCalendarAlt /> Dates</span>
            </Card.Header>
            <Card.Body>
              <Card.Text className={styles.cardTextKey}>Order Date: <span className={styles.cardTextValue}>{formatDate(order.order_date)}</span></Card.Text>
              <Card.Text className={styles.cardTextKey}>Estimated Completion: <span className={styles.cardTextValue}>{formatDate(order.estimated_completion_date)}</span></Card.Text>
              {order.completion_date && <Card.Text className={styles.cardTextKey}>Actual Completion: <span className={styles.cardTextValue}>{formatDate(order.completion_date)}</span></Card.Text>}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className={`mb-4 ${styles.cardCustom}`}>
            <Card.Header className={styles.cardHeaderCustom}>
              <span className={styles.cardHeaderTitle}><FaMoneyBillWave /> Received By</span>
            </Card.Header>
            <Card.Body>
              <Card.Text className={styles.cardTextKey}>Employee Name: <span className={styles.cardTextValue}>{order.employee_first_name} {order.employee_last_name}</span></Card.Text>
              <Card.Text className={styles.cardTextKey}>Employee Phone: <span className={styles.cardTextValue}>{order.employee_phone}</span></Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderView;
