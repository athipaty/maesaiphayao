import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="container">
          <div className="footer-grid">
            {/* Official Info */}
            <div className="footer-section">
              <h4 className="footer-subtitle">องค์การบริหารส่วนตำบล แม่สายไทย</h4>
              <ul className="footer-links">
                <li>📍 ตำบล แม่สายไทย อำเภอ แม่สายไทย จังหวัด พะเยา</li>
                <li>📞 โทรศัพท์ : 054-XXXXXX</li>
                <li>📧 อีเมล : info@maesaiphayao.go.th</li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h4 className="footer-subtitle">ลิงก์ที่สำคัญ</h4>
              <ul className="footer-links">
                <li><a href="/">หน้าแรก</a></li>
                <li><a href="/about">เกี่ยวกับเรา</a></li>
                <li><a href="/news">ข่าวสาร</a></li>
                <li><a href="/contact">ติดต่อเรา</a></li>
              </ul>
            </div>

            {/* Services */}
            <div className="footer-section">
              <h4 className="footer-subtitle">บริการ</h4>
              <ul className="footer-links">
                <li><a href="/eservice">e-Service</a></li>
                <li><a href="/complaint">ร้องเรียน</a></li>
                <li><a href="/public-service">บริการสาธารณะ</a></li>
                <li><a href="/procurement">จัดซื้อจัดจ้าง</a></li>
              </ul>
            </div>

            {/* Information */}
            <div className="footer-section">
              <h4 className="footer-subtitle">ข้อมูลข่าวสาร</h4>
              <ul className="footer-links">
                <li><a href="/documents">คลังเอกสาร</a></li>
                <li><a href="/laws">กฎหมาย</a></li>
                <li><a href="/info-center">ศูนย์ข้อมูลข่าวสาร</a></li>
                <li><a href="/action-plan">แผนงาน</a></li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="footer-divider"></div>

          {/* Bottom */}
          <div className="footer-bottom">
            <p>&copy; {currentYear} องค์การบริหารส่วนตำบล แม่สายไทย สงวนลิขสิทธิ์</p>
            <div className="footer-links-bottom">
              <a href="#privacy">นโยบายความเป็นส่วนตัว</a>
              <span className="separator">•</span>
              <a href="#terms">เงื่อนไขการใช้งาน</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
