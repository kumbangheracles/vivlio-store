import { Modal, message } from "antd";
import { useEffect, useState } from "react";
import type { UserProperties } from "../types/user.type";
import myAxios from "../helper/myAxios";
import { useLocation, useNavigate } from "react-router-dom";
const SESSION_DURATION = 10 * 60 * 1000; // 10 menit
const MODAL_BEFORE = 30 * 1000; // 30 detik sebelum logout
export const useSessionManager = (
  user: UserProperties | undefined,
  setUser: (user: UserProperties | undefined) => void
) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [logoutTimer, setLogoutTimer] = useState<NodeJS.Timeout>();
  const [modalTimer, setModalTimer] = useState<NodeJS.Timeout>();
  const location = useLocation();
  const navigate = useNavigate();
  const publicPaths = ["/login", "/register", "/forgot-password"]; // halaman tanpa session

  useEffect(() => {
    // Clear timeout sebelum pasang ulang
    if (logoutTimer) clearTimeout(logoutTimer);
    if (modalTimer) clearTimeout(modalTimer);

    // Jangan set timer kalau di halaman public
    if (publicPaths.includes(location.pathname)) return;

    if (user) {
      const modal = setTimeout(() => {
        setModalVisible(true);
      }, SESSION_DURATION - MODAL_BEFORE);

      const logout = setTimeout(() => {
        handleLogout();
      }, SESSION_DURATION);

      setModalTimer(modal);
      setLogoutTimer(logout);
    }

    return () => {
      if (logoutTimer) clearTimeout(logoutTimer);
      if (modalTimer) clearTimeout(modalTimer);
    };
  }, [user, location.pathname]);

  const handleLogout = () => {
    setUser(undefined);
    localStorage.removeItem("user");
    message.info("Session expired, please login again.");
    navigate("/login");
  };

  const handleStay = async () => {
    try {
      await myAxios.get("/auth/me"); // validasi token
      message.success("Session refreshed");
      setModalVisible(false);

      // Reset ulang timer
      if (logoutTimer) clearTimeout(logoutTimer);
      if (modalTimer) clearTimeout(modalTimer);

      const newModal = setTimeout(() => {
        setModalVisible(true);
      }, SESSION_DURATION - MODAL_BEFORE);

      const newLogout = setTimeout(() => {
        handleLogout();
      }, SESSION_DURATION);

      setModalTimer(newModal);
      setLogoutTimer(newLogout);

      console.log("Success refresh session and reset timer");
    } catch (err) {
      handleLogout();
      console.log("error: ", err);
    }
  };

  return {
    ModalComponent: (
      <Modal
        title="Are you still there?"
        open={modalVisible}
        onOk={handleStay}
        onCancel={() => {
          setModalVisible(false);
          handleLogout();
        }}
        okText="Yes"
        cancelText="No"
        centered
      >
        <p>Your session is about to expire. Are you still there?</p>
      </Modal>
    ),
  };
};
