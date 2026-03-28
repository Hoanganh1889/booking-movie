import { useEffect, useState } from "react";
import api from "../services/api";

const formatCurrency = (value) => `${Number(value || 0).toLocaleString("vi-VN")} đ`;

const statusLabels = {
  pending: "Chờ duyệt",
  confirmed: "Đã xác nhận",
  cancelled: "Đã hủy",
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings/mine");
      setBookings(res.data);
    } catch (error) {
      alert(error?.response?.data?.message || "Không tải được lịch sử booking");
    }
  };

  return (
    <section className="content-stack">
      <div className="section-heading">
        <div>
          <p className="section-heading__eyebrow">Tài khoản</p>
          <h3>Booking của tôi</h3>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <h4>Bạn chưa có booking nào</h4>
          <p>Hãy chọn phim và đặt vé để bắt đầu.</p>
        </div>
      ) : (
        <div className="panel table-panel">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Phim</th>
                  <th>Suất chiếu</th>
                  <th>Số vé</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((item) => (
                  <tr key={item._id}>
                    <td>{item.movieTitle}</td>
                    <td>{item.showtime}</td>
                    <td>{item.seats}</td>
                    <td>{formatCurrency(item.total)}</td>
                    <td>
                      <span className={`status-badge status-badge--${item.status}`}>
                        {statusLabels[item.status] || item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
