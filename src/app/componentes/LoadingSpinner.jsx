export default function LoadingSpinner() {
  return (
    // 1. CONTAINER EXTERNO (Tela Cheia)
    <div style={{
      display: 'flex',
      justifyContent: 'center', // Centraliza horizontalmente
      alignItems: 'center',     // Centraliza verticalmente
      height: '100vh',          // Garante que ocupe a altura total da viewport
      backgroundColor: '#f8fafc' // Fundo cinza claro
    }}>
      
      {/* 2. O SPINNER CIRCULAR (O Truque Visual) */}
      <div style={{
        width: '40px',
        height: '40px',
        // Cria a borda base (fina e cinza)
        border: '4px solid #e2e8f0', 
        // Sobrescreve apenas a borda superior com a cor de destaque (azul)
        borderTop: '4px solid #3498db', 
        borderRadius: '50%', // Transforma o div em um círculo
        // Aplica a animação definida abaixo
        animation: 'spin 1s linear infinite' 
      }}></div>
      
      {/* 3. ESTILOS DA ANIMAÇÃO (@keyframes) */}
      {/* O bloco <style jsx> é uma feature comum em Next.js para injetar CSS no componente */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }  /* Começa sem rotação */
          100% { transform: rotate(360deg); } /* Gira 360 graus */
        }
      `}</style>
    </div>
  );
}