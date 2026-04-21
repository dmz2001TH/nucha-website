import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

interface BookingEmailData {
  name: string
  email: string
  date: string
  timeSlot: string
  topic?: string
}

export async function sendBookingConfirmation(data: BookingEmailData) {
  const { name, email, date, timeSlot, topic } = data

  const formattedDate = new Date(date).toLocaleDateString('th-TH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #f5f5f5; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: #C41E3A; color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 30px; }
        .info-box { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
        .info-row:last-child { border-bottom: none; }
        .label { color: #666; font-weight: 500; }
        .value { color: #333; font-weight: 600; }
        .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>NUCHA INNOVATION VILL</h1>
          <p>ยืนยันการจองคิวปรึกษา</p>
        </div>
        <div class="content">
          <p>สวัสดีคุณ <strong>${name}</strong></p>
          <p>ขอบคุณที่จองคิวปรึกษากับเรา นี่คือรายละเอียดการจองของคุณ:</p>
          
          <div class="info-box">
            <div class="info-row">
              <span class="label">📅 วันที่</span>
              <span class="value">${formattedDate}</span>
            </div>
            <div class="info-row">
              <span class="label">⏰ เวลา</span>
              <span class="value">${timeSlot}</span>
            </div>
            ${topic ? `<div class="info-row">
              <span class="label">📋 หัวข้อ</span>
              <span class="value">${topic}</span>
            </div>` : ''}
          </div>
          
          <p>ทีมงานจะติดต่อกลับเพื่อยืนยันนัดหมายอีกครั้ง</p>
          <p>หากต้องการเปลี่ยนแปลงหรือยกเลิก กรุณาติดต่อเรา</p>
          
          <p style="margin-top: 30px;">
            📞 +66 (0) 81-234-5678<br>
            ✉️ concierge@nucha-innovation.com
          </p>
        </div>
        <div class="footer">
          <p>© 2026 NUCHA INNOVATION VILL PATTAYA</p>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    await transporter.sendMail({
      from: `"NUCHA INNOVATION VILL" <${process.env.SMTP_USER || 'noreply@nucha-innovation.com'}>`,
      to: email,
      subject: `ยืนยันการจองคิว - ${formattedDate} เวลา ${timeSlot}`,
      html
    })
    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}

export async function sendAdminNotification(data: BookingEmailData & { phone: string; message?: string }) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER

  const formattedDate = new Date(data.date).toLocaleDateString('th-TH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #f5f5f5; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: #C41E3A; color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .alert { background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 15px; margin-bottom: 20px; }
        .info-box { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .button { display: inline-block; background: #C41E3A; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 มีการจองคิวใหม่!</h1>
        </div>
        <div class="content">
          <div class="alert">
            <strong>⚠️ กรุณาตรวจสอบและยืนยันการจอง</strong>
          </div>
          
          <div class="info-box">
            <p><strong>👤 ชื่อ:</strong> ${data.name}</p>
            <p><strong>✉️ อีเมล:</strong> ${data.email}</p>
            <p><strong>📞 โทรศัพท์:</strong> ${data.phone}</p>
            <p><strong>📅 วันที่:</strong> ${formattedDate}</p>
            <p><strong>⏰ เวลา:</strong> ${data.timeSlot}</p>
            ${data.topic ? `<p><strong>📋 หัวข้อ:</strong> ${data.topic}</p>` : ''}
            ${data.message ? `<p><strong>💬 ข้อความ:</strong> ${data.message}</p>` : ''}
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/bookings" class="button">
              จัดการการจอง →
            </a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    await transporter.sendMail({
      from: `"NUCHA System" <${process.env.SMTP_USER || 'noreply@nucha-innovation.com'}>`,
      to: adminEmail,
      subject: `🔔 มีการจองคิวใหม่จาก ${data.name} - ${formattedDate}`,
      html
    })
    return true
  } catch (error) {
    console.error('Error sending admin notification:', error)
    return false
  }
}
