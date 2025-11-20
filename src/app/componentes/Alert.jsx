// Componente Client-Side (Next.js)
"use client";

import { useEffect, useState } from "react";
import styles from "../styles/alert.module.css";

/**
 * Componente Toast/Alerta Global.
 * Ele escuta o evento 'show-alert' disparado em qualquer parte da aplicação 
 * (inclusive fora do React) e exibe a notificação.
 */
export default function Alert() {
    // Estado que armazena a lista de alertas ativos
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        // 1. Função Handler: Captura o evento e formata o alerta
        const handler = (e) => {
            const detail = e.detail || {};
            // Cria um ID único para o novo alerta (garante que o React renderize)
            const id = Date.now() + Math.random();
            const alert = {
                id,
                type: detail.type || "success", // Tipo padrão é 'success'
                title: detail.title || "",
                message: detail.message || "",
                duration: detail.duration ?? 4000, // Duração padrão: 4 segundos
            };
            
            // Adiciona o novo alerta ao estado
            setAlerts((s) => [...s, alert]);
            
            // 2. Auto Remoção: Agenda o fim da vida do alerta
            setTimeout(() => {
                // Filtra e remove o alerta pelo ID após a duração + margem de segurança
                setAlerts((s) => s.filter((a) => a.id !== id));
            }, alert.duration + 200);
        };

        // 3. Setup: Adiciona o listener para o evento 'show-alert'
        // Este é o coração da arquitetura desacoplada.
        window.addEventListener("show-alert", handler);

        // 4. Helper Global: Cria uma função de atalho (para uso em JS puro)
        window.showAlert = (opts) => window.dispatchEvent(new CustomEvent("show-alert", { detail: opts }));

        // 5. Cleanup: Função de limpeza que roda quando o componente é desmontado
        return () => {
            window.removeEventListener("show-alert", handler);
            // Remove o helper global para não poluir o escopo (boa prática)
            try { delete window.showAlert; } catch (err) { }
        };
    }, []); // Array vazio garante que o efeito rode apenas uma vez (ao montar)

    // Função para remover o alerta via clique do usuário no botão 'X'
    const remove = (id) => setAlerts((s) => s.filter((a) => a.id !== id));

    // Não renderiza nada se não houver alertas
    if (!alerts.length) return null;

    return (
        // aria-live="polite" é crucial para Acessibilidade (avisa leitores de tela sobre novos conteúdos)
        <div className={styles.toastContainer} aria-live="polite">
            {alerts.map((a) => (
                <div
                    key={a.id}
                    // Aplica a classe de cor baseada no tipo (success/error/etc.)
                    className={`${styles.toast} ${a.type === "success" ? styles.toastSuccess : a.type === "error" ? styles.toastError : ""}`}
                    role="status" // Define o conteúdo como um status ou notificação
                >
                    <div className={styles.toastContent}>
                        {a.title ? <span className={styles.toastTitle}>{a.title}</span> : null}
                        <div className={styles.toastMessage}>{a.message}</div>
                    </div>
                    {/* Botão de Fechar */}
                    <button 
                        aria-label="Fechar" 
                        className={styles.toastClose} 
                        onClick={() => remove(a.id)}
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
}