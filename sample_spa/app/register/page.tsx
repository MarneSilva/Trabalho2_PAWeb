"use client";

import { AuthContext } from "@/context/AuthContext";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";


const Register = ({ }) => {
    // Variáveis de useRouter para a navegação e useStates para o controle de variáveis.
    const router = useRouter()
    const { registerUser, registerError } = useContext(AuthContext);
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [isAdmin, setAdmin] = useState<boolean>(true)
    // Função que faz o handle quando clica no botão de cadastro, para a validação de credenciais no arquivo AuthContext
    const saveUser = (username:string, password:string, isAdmin:boolean) => {
        isAdmin = true
        registerUser(username, password, isAdmin);
    }


    return (
        <main>
            <div className="h-screen bg-gradient-to-r from-blue-400 md:to-purple-400">
                <form className="flex flex-col items-center mt-10">
                    <h1 className="text-2xl sm:text-4xl tracking-wide text-center pt-8 pb-10 font-light ">
                        Register page
                    </h1>
                    <label htmlFor="username">Usuário: </label>
                    <input
                        className="rounded-md font-light"
                        type="text"
                        name='username'
                        id='username'
                        placeholder="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label htmlFor="password">Senha: </label>
                    <input
                        className="rounded-md font-light"
                        type="password"
                        name='password'
                        id='password'
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="space-y-3">
                        <button
                            type="button"
                            className="bg-gray-600 font-light text-white px-1 py-1 rounded-lg mt-4 hover:bg-blue-600 items-center"
                            value="Registrar"
                            onClick={() => {
                                saveUser(username, password, isAdmin) // Função que salva o usuário no banco de dados.
                                router.push('/login') // Passa o usuário para a página de login, uma vez salvo.
                            }}
                        >
                            Registrar
                        </button>
                    </div>
                </form>
                {registerError && <p className="font-light items-center text-center mt-4">{registerError}</p>}
            </div>
        </main>
    );
}

export default Register;