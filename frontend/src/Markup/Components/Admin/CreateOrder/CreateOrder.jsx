import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../../../Services/order.service';
import { Card, Form, Button, Container, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTimes, FaPlus } from 'react-icons/fa';
import styles from './CreateOrder.module.css';

const CreateOrder = () => {
  const [order, setOrder] = useState({
    employee_id: '1',
    customer_id: '1',
    vehicle_id: '22',
    order_description: '',
    estimated_completion_date: '',
    order_services: [],
    order_total_price: '',
    additional_request: '',
    notes_for_internal_use: '',
    notes_for_customer: '',
    order_status: 'received'
  });

  const [customer, setCustomer] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone_number: '123-456-7890',
    active_status: true
  });

  const [vehicle, setVehicle] = useState({
    name: 'Toyota Camry',
    color: 'Red',
    tag: 'ABC123',
    year: '2020',
    mileage: '15000',
    serial: '1HGCM82633A123456'
  });

  const [services, setServices] = useState([
    { id: 1, name: 'Oil Change', description: 'Change the engine oil and replace the oil filter.' },
    { id: 2, name: 'Tire Rotation', description: 'Rotate the tires to ensure even wear.' },
    { id: 3, name: 'Brake Inspection', description: 'Inspect the brake pads and rotors for wear.' }
  ]);

  const [showCustomerDetails, setShowCustomerDetails] = useState(true);
  const [showVehicleDetails, setShowVehicleDetails] = useState(true);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

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
        ? [...prevOrder.order_services, { service_id: parseInt(value), service_completed: 0 }]
        : prevOrder.order_services.filter((service) => service.service_id !== parseInt(value));
      return { ...prevOrder, order_services: newServices };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!order.order_description.trim()) newErrors.order_description = "Order description is required";
    if (!order.estimated_completion_date) newErrors.estimated_completion_date = "Estimated completion date is required";
    if (!order.order_total_price) newErrors.order_total_price = "Total price is required";
    if (!order.additional_request.trim()) newErrors.additional_request = "Additional request is required";
    if (!order.notes_for_customer.trim()) newErrors.notes_for_customer = "Notes for customer is required";
    if (!order.notes_for_internal_use.trim()) newErrors.notes_for_internal_use = "Notes for internal use is required";
    if (order.order_services.length === 0) newErrors.order_services = "At least one service must be selected";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await createOrder(order);
        navigate('/orders');
      } catch (error) {
        console.error('Error creating order:', error);
        setErrors({ ...errors, submit: 'Failed to create order. Please try again.' });
      }
    }
  };


  return (
    <Container>
      <h1 className="mb-4" style={{ color: '#081e5b', fontWeight: 'bold' }}>Create a New Order</h1>

      <Card className={`mb-4 ${styles['card-custom']}`}>
        <Card.Header className={styles['card-header-custom']}>
          <span className={styles['card-header-title']}>{customer.name}</span>
          <Button variant="link" onClick={() => setShowCustomerDetails(!showCustomerDetails)} className={styles['button-toggle']}>
            {showCustomerDetails ? <FaTimes /> : <FaPlus />}
          </Button>
        </Card.Header>
        {showCustomerDetails && (
          <Card.Body>
            <Card.Text className={styles['card-text-key']}>Email: <span className={styles['card-text-value']}>{customer.email}</span></Card.Text>
            <Card.Text className={styles['card-text-key']}>Phone Number: <span className={styles['card-text-value']}>{customer.phone_number}</span></Card.Text>
            <Card.Text className={styles['card-text-key']}>Active Customer: <span className={styles['card-text-value']}>{customer.active_status ? 'Yes' : 'No'}</span></Card.Text>
            <Card.Text className={styles['card-text-key']}>Edit customer info: <FaEdit style={{ color: 'orangered', cursor: 'pointer' }} /></Card.Text>
          </Card.Body>
        )}
      </Card>

      <Card className={`mb-4 ${styles['card-custom']}`}>
        <Card.Header className={styles['card-header-custom']}>
          <span className={styles['card-header-title']}>{vehicle.name}</span>
          <Button variant="link" onClick={() => setShowVehicleDetails(!showVehicleDetails)} className={styles['button-toggle']}>
            {showVehicleDetails ? <FaTimes /> : <FaPlus />}
          </Button>
        </Card.Header>
        {showVehicleDetails && (
          <Card.Body>
            <Card.Text className={styles['card-text-key']}>Vehicle Color: <span className={styles['card-text-value']}>{vehicle.color}</span></Card.Text>
            <Card.Text className={styles['card-text-key']}>Vehicle Tag: <span className={styles['card-text-value']}>{vehicle.tag}</span></Card.Text>
            <Card.Text className={styles['card-text-key']}>Vehicle Year: <span className={styles['card-text-value']}>{vehicle.year}</span></Card.Text>
            <Card.Text className={styles['card-text-key']}>Vehicle Mileage: <span className={styles['card-text-value']}>{vehicle.mileage}</span></Card.Text>
            <Card.Text className={styles['card-text-key']}>Vehicle Serial: <span className={styles['card-text-value']}>{vehicle.serial}</span></Card.Text>
            <Card.Text className={styles['card-text-key']}>Edit vehicle info: <FaEdit style={{ color: 'orangered', cursor: 'pointer' }} /></Card.Text>
          </Card.Body>
        )}
      </Card>

      <Form onSubmit={handleSubmit}>
        <Card className={`mb-4 ${styles['card-custom']}`}>
          <Card.Header className={styles['card-header-custom']}>
            <span className={styles['card-header-title']}>Choose Services</span>
          </Card.Header>
          <Card.Body>
            {services.map((service) => (
              <Row key={service.id} className="align-items-center mb-2" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '10px', borderRadius: '5px' }}>
                <Col>
                  <Card.Text style={{ fontSize: '1.1rem', color: '#081e5b', fontWeight: 'bold' }}>{service.name}</Card.Text>
                  <Card.Text className="text-muted">{service.description}</Card.Text>
                </Col>
                <Col xs="auto">
                  <Form.Check
                    type="checkbox"
                    value={service.id}
                    onChange={handleServiceChange}
                    style={{ transform: 'scale(1.5)' }}
                  />
                </Col>
              </Row>
            ))}
            {errors.order_services && (
              <div className="text-danger mt-2">{errors.order_services}</div>
            )}
          </Card.Body>
        </Card>

        <Card className={`mb-4 ${styles['card-custom']}`}>
          <Card.Header className={styles['card-header-custom']}>
            <span className={styles['card-header-title']}>Order Details<span style={{ color: 'orangered' }}>____</span></span>
          </Card.Header>
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Label>Order Description</Form.Label>
              <Form.Control
                as="textarea"
                name="order_description"
                value={order.order_description}
                onChange={handleChange}
                className={styles['form-control']}
                isInvalid={!!errors.order_description}
              />
              <Form.Control.Feedback type="invalid">
                {errors.order_description}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Estimated Completion Date and Time</Form.Label>
              <Form.Control
                type="datetime-local"
                name="estimated_completion_date"
                value={order.estimated_completion_date}
                onChange={handleChange}
                className={styles['form-control']}
                isInvalid={!!errors.estimated_completion_date}
              />
              <Form.Control.Feedback type="invalid">
                {errors.estimated_completion_date}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Order Status</Form.Label>
              <Form.Select
                name="order_status"
                value={order.order_status}
                onChange={handleChange}
                className={styles['form-control']}
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
                value={order.order_total_price}
                onChange={handleChange}
                className={styles['form-control']}
                isInvalid={!!errors.order_total_price}
              />
              <Form.Control.Feedback type="invalid">
                {errors.order_total_price}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Additional Request</Form.Label>
              <Form.Control
                as="textarea"
                name="additional_request"
                value={order.additional_request}
                onChange={handleChange}
                className={styles['form-control']}
                isInvalid={!!errors.additional_request}
              />
              <Form.Control.Feedback type="invalid">
                {errors.additional_request}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Notes for Customer</Form.Label>
              <Form.Control
                as="textarea"
                name="notes_for_customer"
                value={order.notes_for_customer}
                onChange={handleChange}
                className={styles['form-control']}
                isInvalid={!!errors.notes_for_customer}
              />
              <Form.Control.Feedback type="invalid">
                {errors.notes_for_customer}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Notes for Internal Use</Form.Label>
              <Form.Control
                as="textarea"
                name="notes_for_internal_use"
                value={order.notes_for_internal_use}
                onChange={handleChange}
                className={styles['form-control']}
                isInvalid={!!errors.notes_for_internal_use}
              />
              <Form.Control.Feedback type="invalid">
                {errors.notes_for_internal_use}
              </Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" className={styles['button-custom']}>
              Submit Order
            </Button>
          </Card.Body>
        </Card>
      </Form>
    </Container>
  );
};

export default CreateOrder;
