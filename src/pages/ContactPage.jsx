export default function ContactPage() {
  return (
    <div>
      <div className="card">
        <div className="section-head">
          <h2 className="text-sm font-semibold">📍 ติดต่อเรา</h2>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Info */}
          <div>
            <h3 className="text-base font-bold text-primary mb-4">องค์การบริหารส่วนตำบลแม่ใส</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <span className="text-lg">📍</span>
                <div>
                  <p className="font-medium">ที่อยู่</p>
                  <p className="text-gray-500">198 ม.12 ตำบลแม่ใส อำเภอเมืองพะเยา จังหวัดพะเยา 56000</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-lg">📞</span>
                <div>
                  <p className="font-medium">โทรศัพท์</p>
                  <p className="text-gray-500">0-5488-9909</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-lg">📧</span>
                <div>
                  <p className="font-medium">อีเมล</p>
                  <p className="text-gray-500">saraban_06560115@dla.go.th</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-lg">🕐</span>
                <div>
                  <p className="font-medium">เวลาทำการ</p>
                  <p className="text-gray-500">วันจันทร์ – ศุกร์ เวลา 08:30 – 16:30 น.</p>
                  <p className="text-gray-400 text-xs">(หยุดวันเสาร์ – อาทิตย์ และวันหยุดนักขัตฤกษ์)</p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <a href="https://www.facebook.com/MaesaiSAOPhayao" target="_blank" rel="noreferrer"
                className="btn-primary text-xs px-3 py-1.5">📘 Facebook</a>
              <a href="https://liff.line.me/1645278921-kWRPP32q/?accountId=traffyfondue" target="_blank" rel="noreferrer"
                className="btn-ghost text-xs px-3 py-1.5">📍 Traffy Fondue</a>
            </div>
          </div>

          {/* Map embed */}
          <div>
            <div className="rounded-md overflow-hidden border border-gray-200 h-64 bg-blue-50 flex items-center justify-center text-gray-400 text-sm">
              <iframe
                title="แผนที่ อบต.แม่ใส"
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d500!2d99.876361!3d19.1321714!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTnCsDA3JzU1LjgiTiA5OcKwNTInMzUuNSJF!5e0!3m2!1sth!2sth!4v1700000000001"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}