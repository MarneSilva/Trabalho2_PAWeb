"use client";

import { createContext, useState } from "react";
import { request } from '../services/request';
import { setCookie } from 'nookies';
import { useRouter } from "next/navigation";

export type SignIdData = {
    username: string;
    password: string;
}

type AuthContextType = {
    login: (data: SignIdData) => void;
    registerUser: (username: string, password: string, isAdmin: boolean) => void;
    authError: string | null;
    registerError: string | null;
}

type UserAuthentication = {
    'x-access-token': string
}

type RegisterResponse = { // Implementação de um tipo a mais para lidar com o statusCode em formato de número.
    'statusCode': number
}

export const AuthContext = createContext({} as AuthContextType);


export default function AuthProvider( { children }: { children: React.ReactNode } ){
    const [authError, setAuthError] = useState<string | null>(null); // Controle de variáveis com o useState
    const [registerError, setRegisterError] = useState<string | null>(null)
    const router = useRouter(); // Montar o useRouter para forçar o usuário a ir para /calendar ou /login

    // Função que realiza a checagem das credenciais com o back-end
    async function login({username, password} : SignIdData) {
        // Requisição para o back-end com os dados recebidos
        let {'x-access-token': token} = await request<UserAuthentication>('http://127.0.0.1:5000/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password}),
            referrerPolicy: 'no-referrer',
            cache: 'no-store'
        }, true);

        // Decisões a serem tomadas caso o back-end valide ou não o usuário.
        if(!token) setAuthError('Usuário ou senha inválidos. Verifique e tente novamente!');
        else{
            setCookie(null, 'auth.token', token, {
                maxAge: 60 * 60 * 1,
            });
            // Se validado, force o usuário a ir para a página de eventos.
            router.push('/calendar');
        }
    }

    const registerUser = async (username:string, password:string, isAdmin:boolean) => {
        // Requisição para o back-end com os dados para o cadastro de usuário.
        let res = await request<RegisterResponse>('http://127.0.0.1:5000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password, isAdmin}),
            referrerPolicy: 'no-referrer',
            cache: 'no-store'
        }, true)
        // Tomada de decisões caso o usuário seja cadastrado ou não.
        if(res.statusCode == 201) { // Caso o usuário seja cadastrado, ele é forçado a ir para a página de login.
            router.push('/login')
        } else {
            setRegisterError('Houve um erro. Código: ' + res.statusCode)
        }
    }
    
    return (
        <AuthContext.Provider value={{login, authError, registerUser, registerError}} >
            {children}
        </AuthContext.Provider>
    );
};