"use client";
import React, {createContext, useState} from 'react';
import { ServerResponse, request } from '@/services/request';

export type Event = {
    _id: number,
    eventName: string,
    data: string,
    time: string,
    description: string
}

type EventContextType = {
    Events: Event[];
    addEvent: (_id:number, eventName:string, data:string, time:string, description:string) => void;
    removeEvent: (_id:number) => void;
    deleteEvent: (_id:number) => void;
    updateEvents: () => void;
    updatedEvents: boolean;
    putEvent: (_id:number, eventName:string, data:string, time:string, description:string) => void;
    refreshPage: () => void;
}

export const EventContext = createContext({} as EventContextType);

export const EventContextProvider = ({ children } : {children: React.ReactNode;}) => {
    // UseStates para controle de variáveis.
    const [Events, setEvents] = useState<Event[]>([]);
    const [loadingEvents, setLoadingEvents] = useState(false);
    const [updatedEvents, setUpdatedEvents] = useState(false);

    // Função que adiciona o evento a lista do navegador
    const addEvent = (_id:number, eventName:string, data:string, time:string, description:string) => {
        let newEvent = {
            _id: _id,
            eventName: eventName,
            data: data,
            time: time,
            description: description
        }
        setEvents([...Events, newEvent]);
    };

    // Função que da refresh na página.
    const refreshPage = () => { 
        window.location.reload(); 
    }

    // Função que deleta o evento do banco de dados.
    const deleteEvent = async (_id:number) => {
        let res = await request<ServerResponse>(`http://127.0.0.1:5000/calendar/${_id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1hcm5lIiwiaWF0IjoxNzE4NTQyNzI5fQ.ygB9dsOhg7XmJzzV61hSoLK3qoy00v0wnhwrvlE2bDo',
                'isAdmin': 'true'
            },
            referrerPolicy: 'no-referrer',
            cache: 'no-store'
        }, false)
    }

    // Função que atualiza a lista do navegador com os itens já existentes no banco de dados.
    const updateEvents = async () => {
        if(!updatedEvents){
            let res = await request<Event[]>('http://127.0.0.1:5000/calendar', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                referrerPolicy: 'no-referrer',
                cache: 'no-store'
            }, false);
            setEvents(res);
            setUpdatedEvents(true);
        }
    }
    // Função que remove o evento da lista do navegador.
    const removeEvent = async (_id:number) => {
        setEvents(Events.filter((_:Event, index:number) =>
            _id !== index
        ))
        console.log(Events)
    };

    // Função que atualiza o evento no banco de dados com os novos valores.
    const putEvent = async (_id:number, eventName:string, data:string, time:string, description:string) => {
        let res = await request<ServerResponse>(`http://127.0.0.1:5000/calendar/${_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1hcm5lIiwiaWF0IjoxNzE4NTQyNzI5fQ.ygB9dsOhg7XmJzzV61hSoLK3qoy00v0wnhwrvlE2bDo',
                'isAdmin': 'true'
            },
            body: JSON.stringify({ _id, eventName, data, time, description }),
            referrerPolicy: 'no-referrer',
            cache: 'no-store'
        }, false)
    }

    return (
        <EventContext.Provider value={{ Events, addEvent, removeEvent, deleteEvent, updateEvents, updatedEvents, putEvent, refreshPage }}>
            {children}
        </EventContext.Provider>
    );
}