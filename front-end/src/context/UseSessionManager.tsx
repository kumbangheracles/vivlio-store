import { Button, Modal, message } from "antd";
import { useEffect, useState } from "react";
import type { UserProperties } from "../types/user.type";
import myAxios from "../helper/myAxios";
import { useLocation, useNavigate } from "react-router-dom";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { ErrorHandler } from "../helper/handleError";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
const SESSION_DURATION = 1 * 60 * 60 * 1000;
const MODAL_BEFORE = 30 * 1000; // 30 detik sebelum logout

const TIMOUT_SESSION = SESSION_DURATION - MODAL_BEFORE;
let remainingTime = TIMOUT_SESSION / 1000;

const countdownInterval = setInterval(() => {
  // console.log(`⏳ Session will expire in ${remainingTime} seconds`);
  remainingTime--;
  if (remainingTime <= 0) {
    clearInterval(countdownInterval);
    console.log("⚠️ Session countdown finished");
  }
}, 1000);
export const useSessionManager = (
  user: UserProperties | undefined,
  setUser?: (user: UserProperties | undefined) => void
) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [logoutTimer, setLogoutTimer] = useState<NodeJS.Timeout>();
  const [modalTimer, setModalTimer] = useState<NodeJS.Timeout>();
  const location = useLocation();
  const navigate = useNavigate();
  const publicPaths = ["/login", "/register", "/forgot-password"]; // halaman tanpa session
  const signOut = useSignOut();
  const authHeader = useAuthHeader();

  useEffect(() => {
    if (logoutTimer) clearTimeout(logoutTimer);
    if (modalTimer) clearTimeout(modalTimer);

    if (publicPaths.includes(location.pathname)) return;

    if (user) {
      const modal = setTimeout(() => {
        setModalVisible(true);
      }, TIMOUT_SESSION);

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

  const handleLogout = async () => {
    try {
      await myAxios.post("/auth/logout");
      message.info("Session expired, please login again.");
      navigate("/login");
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      signOut();
      setModalVisible(false);
    }
  };

  const handleStay = async () => {
    try {
      const token = authHeader?.replace("Bearer ", "");

      if (!token) throw new Error("No auth token found");

      const res = await myAxios.get("/auth/refresh", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
      ErrorHandler(err);
    }
  };

  return {
    ModalComponent: (
      <Modal
        title="Are you still there?"
        open={modalVisible}
        onOk={handleStay}
        okText="I'm still here"
        footer={null}
        centered
        closable={true}
      >
        <p>Your session is about to expire. Are you still there?</p>
        <Button type="primary" onClick={handleStay}>
          I'm still here
        </Button>
      </Modal>
    ),
  };
};
