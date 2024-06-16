'use client';

import { EventContext } from '@/context/EventContext';
import React, { useContext, useState } from 'react';

const UpdateEvent = ({ }) => {
    // UseStates para controle de variáveis para setar o evento na função updateEvent
    const { Events, putEvent, refreshPage } = useContext(EventContext)
    const [_id, setId] = useState();
    const [eventName, setEventName] = useState('');
    const [data, setEventData] = useState('')
    const [time, setEventTime] = useState('')
    const [description, setDescription] = useState('');
    const [addError, setError] = useState('')

    // Função que atualiza o evento em si no banco de dados, fazendo uma request.
    const updateEvent = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        putEvent(_id, eventName, data, time, description)
        refreshPage()
        }

    return ( // Forms e botão para adicionar um evento.
        <div className="text-center mt-10">
            <h3 className="mb-4 text-xl font-light">Update an event</h3>
            <form onSubmit={updateEvent}>
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
                        Atualizar
                    </button>
                </div>
            </form>
            {addError && <p className='mt-6 font-light'>{addError}</p>}
        </div>
    );
};

export default UpdateEvent;