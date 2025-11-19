"use client";

import { useEffect, useState } from "react";
import styles from "../styles/alert.module.css";

export default function Alert() {
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const handler = (e) => {
            const detail = e.detail || {};
            const id = Date.now() + Math.random();
            const alert = {
                id,
                type: detail.type || "success",
                title: detail.title || "",
                message: detail.message || "",
                duration: detail.duration ?? 4000,
            };
            setAlerts((s) => [...s, alert]);
            // auto remove
            setTimeout(() => {
                setAlerts((s) => s.filter((a) => a.id !== id));
            }, alert.duration + 200);
        };

        window.addEventListener("show-alert", handler);

        // helper global (opcional) para mostrar alert via JS
        window.showAlert = (opts) => window.dispatchEvent(new CustomEvent("show-alert", { detail: opts }));

        return () => {
            window.removeEventListener("show-alert", handler);
            try { delete window.showAlert; } catch (err) { }
        };
    }, []);

    const remove = (id) => setAlerts((s) => s.filter((a) => a.id !== id));

    if (!alerts.length) return null;

    return (
        <div className={styles.toastContainer} aria-live="polite">
            {alerts.map((a) => (
                <div
                    key={a.id}
                    className={`${styles.toast} ${a.type === "success" ? styles.toastSuccess : a.type === "error" ? styles.toastError : ""}`}
                    role="status"
                >
                    <div className={styles.toastContent}>
                        {a.title ? <span className={styles.toastTitle}>{a.title}</span> : null}
                        <div className={styles.toastMessage}>{a.message}</div>
                    </div>
                    <button aria-label="Fechar" className={styles.toastClose} onClick={() => remove(a.id)}>✕</button>
                </div>
            ))}
        </div>
    );
}
