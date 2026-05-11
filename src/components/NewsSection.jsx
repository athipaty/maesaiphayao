import React, { useEffect, useState } from 'react';
import './NewsSection.css';

const NewsSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/news');
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <section className="section news-section">
        <div className="container">
          <div className="spinner"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="section news-section" id="news">
      <div className="container">
        <h2 className="section-title">Latest News</h2>
        <p className="section-subtitle">Stay updated with what's happening at Maesai Phayao</p>

        <div className="news-grid">
          {news.length > 0 ? (
            news.map((item) => (
              <article key={item.id} className="news-card">
                {item.image && (
                  <div className="news-image-wrapper">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="news-image"
                    />
                    <div className="news-overlay"></div>
                  </div>
                )}

                <div className="news-content">
                  <div className="news-meta">
                    <span className="news-date">📅 {formatDate(item.createdAt)}</span>
                    <span className="news-badge">New</span>
                  </div>

                  <h3 className="news-title">{item.title}</h3>

                  <p className="news-description">
                    {item.description.length > 150
                      ? `${item.description.substring(0, 150)}...`
                      : item.description}
                  </p>

                  <a href="#readmore" className="read-more">
                    Read More →
                  </a>
                </div>
              </article>
            ))
          ) : (
            <div className="no-news">
              <p>No news available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;