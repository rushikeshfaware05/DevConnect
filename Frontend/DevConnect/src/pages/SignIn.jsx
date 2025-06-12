import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import auth from '../services/auth';

const SignIn = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Detect dark mode based on body class
    const body = document.body;
    setIsDarkMode(body.classList.contains('bg-dark'));

    // Optional: Listen to changes on body class for dark mode toggle
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.body.classList.contains('bg-dark'));
    });

    observer.observe(body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const data = await auth.signIn(formData);

      if (!data || typeof data.success === 'undefined') {
        setError('Unexpected server response');
        return;
      }

      if (data.success === false) {
        setError(data.msg || 'Something went wrong during sign-in.');
      } else {
        setSuccessMessage(data.msg || 'Sign-in successful!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (err) {
      console.error('Sign-in error:', err);
      setError(err.message || 'Failed to connect to the server.');
    } finally {
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
              Sign In to Dev Connect
            </h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  onChange={handleChange}
                  value={formData.email}
                  required
                  className={isDarkMode ? 'bg-dark text-light border-warning' : ''}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  onChange={handleChange}
                  value={formData.password}
                  required
                  className={isDarkMode ? 'bg-dark text-light border-warning' : ''}
                />
              </Form.Group>
              <Button
                type="submit"
                variant={isDarkMode ? 'warning' : 'primary'}
                className="w-100 mt-3"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>

              {error && (
                <Alert variant="danger" className="mt-3 text-center">
                  {error}
                </Alert>
              )}
              {successMessage && (
                <Alert variant={isDarkMode ? 'warning' : 'success'} className="mt-3 text-center">
                  {successMessage}
                </Alert>
              )}
            </Form>
            <p className={`mt-3 text-center ${isDarkMode ? 'text-light' : 'text-muted'}`}>
              Don't have an account?{' '}
              <Link to="/signup" className={isDarkMode ? 'text-warning' : 'text-primary'}>
                Sign Up
              </Link>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SignIn;
