import AddEvent from "@/components/AddEvent";
import ListEvent from "@/components/ListEvent";
import UpdateEvent from "@/components/UpdateEvent";
import { EventContextProvider } from "@/context/EventContext";


// Função que carrega a página de eventos na web.
const Events = async ({}) => {
  return (
    <main className="h-screen bg-gradient-to-r from-blue-400 md:to-purple-400">
      <h1 className="text-2xl sm:text-4xl font-light tracking-wide text-center pt-8 pb-10">
        Events list
      </h1>

      <div className="grid place-items-center h-screen bg-gradient-to-r from-blue-400 md:to-purple-400">
        <EventContextProvider> 
          <ListEvent />
          <AddEvent />
          <UpdateEvent />
        </EventContextProvider>
      </div>
    </main>
  );
};

export default Events;