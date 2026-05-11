import React, { useEffect, useState } from 'react';
import NewsSection from '../components/NewsSection';
import './HomePage.css';

const HomePage = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/dishes');
        const data = await response.json();
        setDishes(data.slice(0, 6)); // Get first 6 dishes
      } catch (error) {
        console.error('Error fetching dishes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">🍲 Maesai Phayao</h1>
            <p className="hero-subtitle">Authentic Northern Thai Cuisine</p>
            <p className="hero-description">
              Experience the rich flavors and tradition of Phayao's most beloved dishes
            </p>
            <div className="hero-buttons">
              <a href="#menu" className="btn btn-primary">
                Explore Menu
              </a>
              <a href="#contact" className="btn btn-outline">
                Make Reservation
              </a>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-image-placeholder">🍜</div>
          </div>
        </div>
      </section>

      {/* Featured Dishes Section */}
      <section className="section featured-section" id="menu">
        <div className="container">
          <h2 className="section-title">Featured Dishes</h2>
          <p className="section-subtitle">Try our most popular Northern Thai specialties</p>

          {loading ? (
            <div className="spinner"></div>
          ) : (
            <div className="dishes-grid">
              {dishes.length > 0 ? (
                dishes.map((dish) => (
                  <div key={dish.id} className="dish-card">
                    {dish.image && (
                      <div className="dish-image-wrapper">
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="dish-image"
                        />
                        <div className="dish-badge">{dish.price} ฿</div>
                      </div>
                    )}

                    <div className="dish-content">
                      <h3 className="dish-name">{dish.name}</h3>
                      <p className="dish-description">{dish.description}</p>
                      <div className="dish-footer">
                        <span className="dish-category">{dish.category}</span>
                        <button className="btn-small">Order Now</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-dishes">
                  <p>No dishes available at the moment.</p>
                </div>
              )}
            </div>
          )}

          <div className="view-all">
            <a href="/menu" className="btn btn-secondary">
              View Full Menu
            </a>
          </div>
        </div>
      </section>

      {/* News Section */}
      <NewsSection />

      {/* About Section */}
      <section className="section about-section" id="about">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2 className="section-title">About Us</h2>
              <p>
                At Maesai Phayao, we bring you the authentic taste of Northern Thailand. 
                With recipes passed down through generations, every dish is prepared with 
                fresh ingredients and traditional cooking methods.
              </p>
              <p>
                Our mission is to share the culinary heritage of Phayao with the world, 
                one delicious bowl at a time.
              </p>
              <a href="#contact" className="btn btn-primary">
                Get In Touch
              </a>
            </div>
            <div className="about-image">
              <div className="about-image-placeholder">👨‍🍳</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section contact-section" id="contact">
        <div className="container">
          <h2 className="section-title">Contact Us</h2>
          <p className="section-subtitle">Get in touch with us</p>

          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <div>
                  <h4>Location</h4>
                  <p>123 Phayao Road, Phayao 56000</p>
                </div>
              </div>

              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <div>
                  <h4>Phone</h4>
                  <p>+66 (0) 54-000-1234</p>
                </div>
              </div>

              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <div>
                  <h4>Email</h4>
                  <p>info@maesaiphayao.com</p>
                </div>
              </div>

              <div className="contact-item">
                <span className="contact-icon">⏰</span>
                <div>
                  <h4>Hours</h4>
                  <p>Mon-Sun: 10:00 AM - 10:00 PM</p>
                </div>
              </div>
            </div>

            <form className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" placeholder="Your name" required />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Your email" required />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  placeholder="Your message"
                  rows="5"
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;