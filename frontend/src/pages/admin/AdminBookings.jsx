import { useEffect, useState } from "react";
import api from "../../services/api";

const formatCurrency = (value) => `${Number(value || 0).toLocaleString("vi-VN")} đ`;

const statusLabels = {
  pending: "Chờ duyệt",
  confirmed: "Đã xác nhận",
  cancelled: "Đã hủy",
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings");
      setBookings(res.data);
    } catch (error) {
      console.error(error);
      alert("Không tải được booking");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      alert("Cập nhật trạng thái thành công");
      fetchBookings();
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Cập nhật trạng thái thất bại");
    }
  };

  return (
    <section className="content-stack">
      <div className="panel table-panel">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">Theo dõi giao dịch</p>
            <h3>{bookings.length} booking</h3>
          </div>
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Email/User</th>
                <th>SĐT</th>
                <th>Phim</th>
                <th>Suất chiếu</th>
                <th>Số vé</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Duyệt</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((item) => (
                <tr key={item._id}>
                  <td>{item.customerName}</td>
                  <td>{item.userId?.email || "-"}</td>
                  <td>{item.phone}</td>
                  <td>{item.movieTitle}</td>
                  <td>{item.showtime}</td>
                  <td>{item.seats}</td>
                  <td>{formatCurrency(item.total)}</td>
                  <td>
                    <span className={`status-badge status-badge--${item.status}`}>
                      {statusLabels[item.status] || item.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-group">
                      {item.status !== "confirmed" && (
                        <button className="btn" onClick={() => updateStatus(item._id, "confirmed")} type="button">
                          Xác nhận
                        </button>
                      )}

                      {item.status !== "cancelled" && (
                        <button className="btn btn-secondary" onClick={() => updateStatus(item._id, "cancelled")} type="button">
                          Hủy
                        </button>
                      )}

                      {item.status === "cancelled" && (
                        <button className="btn" onClick={() => updateStatus(item._id, "pending")} type="button">
                          Khôi phục
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
