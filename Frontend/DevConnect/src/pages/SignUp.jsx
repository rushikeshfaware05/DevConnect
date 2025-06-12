import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  // Detect dark mode by checking body class
  useEffect(() => {
    const body = document.body;
    setIsDarkMode(body.classList.contains('bg-dark'));

    const observer = new MutationObserver(() => {
      setIsDarkMode(document.body.classList.contains('bg-dark'));
    });

    observer.observe(body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null,
      }));
    }
    setErrorMessage('');
    setSuccessMessage('');
  };

  const validateForm = () => {
    let newErrors = {};
    const { password } = formData;

    if (!password) {
      newErrors.password = 'Password is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    setLoading(true);

    if (validateForm()) {
      try {
        const response = await fetch('http://localhost:3000/auth/sign-up', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (data.success) {
          setSuccessMessage(data.msg || 'Account created successfully! Redirecting...');
          setFormData({ username: '', email: '', password: '' });
          setErrors({});

          setTimeout(() => {
            navigate('/signin');
          }, 1500);
        } else {
          setErrorMessage(data.msg || 'Registration failed. Please try again.');
        }
      } catch (error) {
        console.error('Error during signup:', error);
        setErrorMessage('Network error or server unavailable. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      setErrorMessage('Please correct the errors in the form.');
      setLoading(false);
    }
  };

  return (
    <Container
      fluid
      className={`d-flex justify-content-center align-items-center min-vh-100 p-4 ${
        isDarkMode ? 'bg-dark text-light' : 'bg-light text-dark'
      }`}
    >
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={5} xl={4}>
          <div
            className={`card p-4 shadow-lg rounded ${
              isDarkMode ? 'bg-secondary border-warning text-light' : 'bg-white border-primary'
            }`}
          >
            <h2 className={`card-title text-center mb-4 fw-bold ${isDarkMode ? 'text-warning' : 'text-primary'}`}>
              Sign Up for Dev Connect
            </h2>

            {successMessage && (
              <Alert variant={isDarkMode ? 'warning' : 'success'} className="mb-4 text-center">
                {successMessage}
              </Alert>
            )}
            {errorMessage && (
              <Alert variant="danger" className="mb-4 text-center">
                {errorMessage}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  isInvalid={!!errors.username}
                  placeholder="Enter username"
                  className={isDarkMode ? 'bg-dark text-light border-warning' : ''}
                />
                <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                  placeholder="Enter email"
                  className={isDarkMode ? 'bg-dark text-light border-warning' : ''}
                />
                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                  placeholder="Password"
                  className={isDarkMode ? 'bg-dark text-light border-warning' : ''}
                />
                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
              </Form.Group>

              <Button
                variant={isDarkMode ? 'warning' : 'primary'}
                type="submit"
                className="w-100 mt-3"
                disabled={loading}
              >
                {loading ? 'Signing Up...' : 'Sign Up'}
              </Button>

              <p className={`mt-3 text-center ${isDarkMode ? 'text-light' : 'text-muted'}`}>
                Already have an account?{' '}
                <Link to="/signin" className={isDarkMode ? 'text-warning' : 'text-primary'}>
                  Sign In
                </Link>
              </p>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUp;
