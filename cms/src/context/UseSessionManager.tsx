import { Button, Modal, message } from "antd";
import { useEffect, useState } from "react";
import type { UserProperties } from "../types/user.type";
import myAxios from "../helper/myAxios";
import { useLocation, useNavigate } from "react-router-dom";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { ErrorHandler } from "../helper/handleError";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
const SESSION_DURATION = 40 * 1000;
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
  const [remainingSeconds, setRemainingSeconds] = useState(30); // default 30 detik sebelum logout
  const [logoutTimer, setLogoutTimer] = useState<NodeJS.Timeout | null>(null);
  const [modalTimer, setModalTimer] = useState<NodeJS.Timeout | null>(null);
  const [countdownInterval, setCountdownInterval] =
    useState<NodeJS.Timeout | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const publicPaths = ["/login", "/register", "/forgot-password"];
  const signOut = useSignOut();
  const authHeader = useAuthHeader();

  // Konfigurasi (dalam milidetik)
  const SESSION_DURATION = 10 * 60 * 1000; // 10 menit
  const MODAL_BEFORE = 30 * 1000; // Tampilkan modal 30 detik sebelum habis
  const SHOW_MODAL_AT = SESSION_DURATION - MODAL_BEFORE; // 9m30s

  // Fungsi reset semua timer
  const clearAllTimers = () => {
    if (logoutTimer) clearTimeout(logoutTimer);
    if (modalTimer) clearTimeout(modalTimer);
    if (countdownInterval) clearInterval(countdownInterval);
    setLogoutTimer(null);
    setModalTimer(null);
    setCountdownInterval(null);
  };

  const handleLogout = async () => {
    clearAllTimers();
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
    clearAllTimers();
    try {
      const token = authHeader?.replace("Bearer ", "");
      if (!token) throw new Error("No auth token found");

      const res = await myAxios.get("/auth/refresh", {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });

      message.success("Session refreshed");
      setModalVisible(false);
      setRemainingSeconds(30); // reset countdown

      // Mulai ulang sesi
      const newModal = setTimeout(() => {
        setModalVisible(true);
        setRemainingSeconds(30);

        // Jalankan countdown saat modal muncul
        const interval = setInterval(() => {
          setRemainingSeconds((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              handleLogout();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        setCountdownInterval(interval);
      }, SHOW_MODAL_AT);

      const newLogout = setTimeout(() => {
        handleLogout();
      }, SESSION_DURATION);

      setModalTimer(newModal);
      setLogoutTimer(newLogout);
    } catch (err) {
      handleLogout();
      ErrorHandler(err);
    }
  };

  useEffect(() => {
    clearAllTimers();

    if (publicPaths.includes(location.pathname) || !user) return;

    // Set timer untuk munculkan modal
    const modal = setTimeout(() => {
      setModalVisible(true);
      setRemainingSeconds(30);

      // Mulai countdown saat modal muncul
      const interval = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setCountdownInterval(interval);
    }, SHOW_MODAL_AT);

    // Set timer untuk auto logout
    const logout = setTimeout(() => {
      handleLogout();
    }, SESSION_DURATION);

    setModalTimer(modal);
    setLogoutTimer(logout);

    return () => {
      clearAllTimers();
    };
  }, [user, location.pathname]);

  return {
    ModalComponent: (
      <Modal
        title="Are you still there?"
        open={modalVisible}
        footer={null}
        centered
        closable={false} // opsional: mencegah close sebelum pilih
        maskClosable={false}
      >
        <div className="!p-4" style={{ padding: "1rem" }}>
          <p>
            Your session will expire in <strong>{remainingSeconds}</strong>{" "}
            second
            {remainingSeconds !== 1 ? "s" : ""}. Are you still there?
          </p>
          <div className="flex justify-end w-full mt-4">
            <Button type="primary" onClick={handleStay}>
              I'm still here
            </Button>
          </div>
        </div>
      </Modal>
    ),
  };
};
