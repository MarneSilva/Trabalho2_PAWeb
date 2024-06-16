'use client';

import { EventContext} from '@/context/EventContext';
import React, { useContext, useState } from 'react';
import { request } from '@/services/request';



const AddEvent = ({ }) => {
    // UseStates para controle de variáveis para setar o evento na função saveEvent
    const { addEvent, removeEvent } = useContext(EventContext)
    const [_id, setId] = useState();
    const [eventName, setEventName] = useState('');
    const [data, setEventData] = useState('')
    const [time, setEventTime] = useState('')
    const [description, setDescription] = useState('');
    const [addError, setError] = useState('')

    // Função que salva o evento em si no banco de dados, fazendo uma request.
    const saveEvent = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        addEvent(_id, eventName, data, time, description);
        setId(_id);
        let res = await request('http://127.0.0.1:5000/calendar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1hcm5lIiwiaWF0IjoxNzE4NTQyNzI5fQ.ygB9dsOhg7XmJzzV61hSoLK3qoy00v0wnhwrvlE2bDo',
                'isAdmin': 'true'
            },
            body: JSON.stringify({ _id, eventName, data, time, description }),
            referrerPolicy: 'no-referrer',
            cache: 'no-store'
        }, true)
        // Tratamento de erro, caso o evento já tenha sido adicionado ou houve uma falha ao adicionar por parte do servidor
        if (res.statusCode == '412' || res.statusCode == '500') {
            // Remove o evento da lista do navegador, para não mostrar um evento que não existe no banco de dados.
            removeEvent(_id)
            setError('Erro. O seu evento não foi adicionado porque ele já existe ou algo grave aconteceu no servidor. Código: ' + res.statusCode)
        }
    }

    return ( // Forms e botão para adicionar um evento.
        <div className="text-center">
            <h3 className="mb-4 text-xl font-light">Add Event</h3>
            <form onSubmit={saveEvent}>
                <div className="space-x-2 space-y-2 font-light">
                    <input
                        type="string"
                        placeholder="Nome"
                        className="border border-graya-500 px-4 py-2 rounded-xl focus:border-blue-600 focus:outline-none focus:border-2"
                        name="name"
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Descrição"
                        className="border border-graya-500 px-4 py-2 rounded-xl focus:border-blue-600 focus:outline-none focus:border-2"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Id"
                        className="border border-graya-500 px-4 py-2 rounded-xl focus:border-blue-600 focus:outline-none focus:border-2"
                        name="id"
                        value={_id}
                        onChange={(e) => setId(parseInt(e.target.value))}
                    />
                    <div className='flex col-span-2 items-center font-light space-x-3'>
                        <input
                            type="string"
                            placeholder="Data (00.00)"
                            className="border border-graya-500 px-4 py-2 rounded-xl focus:border-blue-600 focus:outline-none focus:border-2"
                            name="data"
                            value={data}
                            onChange={(e) => setEventData(e.target.value)}
                        />
                        
                        <input
                            type="string"
                            placeholder="Horas (00:00)"
                            className="border border-graya-500 px-4 py-2 rounded-xl focus:border-blue-600 focus:outline-none focus:border-2"
                            name="time"
                            value={time}
                            onChange={(e) => setEventTime(e.target.value)}
                        />
                    </div>
                </div>
                <div className="space-y-3 space-x-3">
                    <button
                        type="submit"
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg mx-2 hover:bg-blue-600 mt-5"
                    >
                        Incluir
                    </button>
                </div>
            </form>
            {addError && <p className='mt-6 font-light'>{addError}</p>}
        </div>
    );
};

export default AddEvent;