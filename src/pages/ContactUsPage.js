import React from 'react';
import Logo from "../logo/logo.png";

const ContactUsPage = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: 'auto' }}>
      <div 
        style={{ 
          backgroundColor: 'white', 
          padding: '30px', 
          borderRadius: '10px', 
          textAlign: 'center', 
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)' 
        }}
      >
        {/* Logo kopi Kipo coklat */}
        <img 
          src={Logo} 
          alt="Logo Kopi Kipo Coklat" 
          style={{ width: '200px', marginBottom: '20px' }}
        />

        {/* Filosofi kopi Kipo */}
        <h2>Filosofi Kopi Kipo</h2>
        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#5a3e1b' }}>
          Kopi Kipo bukan sekadar minuman, melainkan perpaduan rasa dan tradisi yang menghubungkan setiap cangkirnya dengan kehangatan budaya lokal.
          Di balik aroma coklat yang menggoda dan rasa yang kaya, tersimpan filosofi ketulusan dalam setiap proses pembuatan.
          Kami percaya bahwa secangkir kopi adalah cerita yang menyatukan jiwa dan semangat, melahirkan kebersamaan yang hakiki.
          Nikmatilah Kopi Kipo sebagai simbol cinta dan dedikasi kami dalam menjaga keaslian rasa serta nilai tradisional yang abadi.
        </p>
      </div>

      {/* Footer info tugas */}
      <p style={{ marginTop: '40px', fontSize: '14px', color: '#444', textAlign: 'center' }}>
        Web ini dibuat untuk memenuhi tugas mata kuliah <strong>Perdagangan Elektronik</strong>, 
        disusun oleh:<br />
        Wildan Krisyanto – 1152200013<br />
        William Juniarta Hadiman – 1152625003<br />
        Yukis Millano Putra – 1151800035
      </p>
    </div>
  );
};

export default ContactUsPage;
