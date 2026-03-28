import { useEffect, useState } from "react";
import api from "../services/api";
import { clearCart, getCart, removeFromCart, saveCart } from "../utils/cart";
import { useAuth } from "../context/AuthContext";

const formatCurrency = (value) => `${Number(value || 0).toLocaleString("vi-VN")} đ`;

export default function Cart() {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState(user?.name || "");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    setCart(getCart());
  }, []);

  useEffect(() => {
    if (user?.name) {
      setCustomerName(user.name);
    }
  }, [user]);

  const handleSeatChange = (showtimeId, value) => {
    const newSeats = Math.max(1, Number(value));
    const nextCart = cart.map((item) =>
      item.showtimeId === showtimeId ? { ...item, seats: newSeats } : item,
    );

    setCart(nextCart);
    saveCart(nextCart);
  };

  const handleRemove = (showtimeId) => {
    removeFromCart(showtimeId);
    setCart(getCart());
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.seats, 0);

  const handleConfirmBooking = async () => {
    try {
      if (!customerName || !phone) {
        alert("Vui lòng nhập họ tên và số điện thoại");
        return;
      }

      for (const item of cart) {
        await api.post("/bookings", {
          showtimeId: item.showtimeId,
          customerName,
          phone,
          movieTitle: item.movieTitle,
          showtime: item.showtime,
          seats: item.seats,
          total: item.price * item.seats,
        });
      }

      clearCart();
      setCart([]);
      alert("Đặt vé thành công");
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Đặt vé thất bại");
    }
  };

  return (
    <section className="content-stack">
      <div className="section-heading">
        <div>
          <p className="section-heading__eyebrow">Thanh toán</p>
          <h3>Giỏ vé của bạn</h3>
        </div>
        <p className="section-heading__meta">{cart.length} suất đã chọn</p>
      </div>

      {cart.length === 0 ? (
        <div className="empty-state">
          <h4>Giỏ vé đang trống</h4>
          <p>Chọn một bộ phim và thêm suất chiếu để bắt đầu đặt vé.</p>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="content-stack">
            {cart.map((item) => (
              <article className="cart-item panel" key={item.showtimeId}>
                <div className="cart-item__header">
                  <div>
                    <p className="cart-item__eyebrow">Vé đã chọn</p>
                    <h4>{item.movieTitle}</h4>
                  </div>
                </div>

                <div className="cart-item__grid">
                  <div className="cart-info-card">
                    <span className="cart-info-card__label">Suất chiếu</span>
                    <strong>{item.showtime}</strong>
                  </div>

                  <div className="cart-info-card">
                    <span className="cart-info-card__label">Đơn giá</span>
                    <strong>{formatCurrency(item.price)}</strong>
                  </div>

                  <label className="field field--small cart-field">
                    <span>Số vé</span>
                    <input
                      type="number"
                      min="1"
                      value={item.seats}
                      onChange={(e) => handleSeatChange(item.showtimeId, e.target.value)}
                    />
                  </label>
                </div>

                <div className="cart-item__footer">
                  <div className="cart-total">
                    <span>Tạm tính</span>
                    <strong>{formatCurrency(item.price * item.seats)}</strong>
                  </div>

                  <button className="btn btn-secondary" onClick={() => handleRemove(item.showtimeId)} type="button">
                    Xóa khỏi giỏ
                  </button>
                </div>
              </article>
            ))}
          </div>

          <aside className="booking-form panel booking-form--sticky">
            <div className="section-heading">
              <div>
                <p className="section-heading__eyebrow">Thông tin nhận vé</p>
                <h4>Xác nhận booking</h4>
              </div>
            </div>

            <div className="cart-summary-strip">
              <div className="summary-card">
                <span>Số suất</span>
                <strong>{cart.length}</strong>
              </div>

              <div className="summary-card">
                <span>Tổng số vé</span>
                <strong>{cart.reduce((sum, item) => sum + item.seats, 0)}</strong>
              </div>
            </div>

            <label className="field">
              <span>Họ tên</span>
              <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            </label>

            <label className="field">
              <span>Số điện thoại</span>
              <input
                type="text"
                placeholder="09xxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>

            <div className="summary-card">
              <span>Tổng thanh toán</span>
              <strong>{formatCurrency(total)}</strong>
            </div>

            <button className="btn booking-form__submit" onClick={handleConfirmBooking} type="button">
              Xác nhận đặt vé
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}
