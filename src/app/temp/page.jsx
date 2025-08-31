import Link from "next/link";

export default function Temp() {
    return (
        <div className="container">
            <h1>Acesso a telas</h1>
            <Link href={'/sobre'}>Sobre</Link>
            <Link href={'/contato'}>Contato</Link>
            <Link href={'./cadastro'}>Usuario</Link>
            <Link href={'./login'}>Login</Link>
        
        </div>
    );
}