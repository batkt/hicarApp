import * as React from 'react';

export const LogicContext = React.createContext();

export default function Logic({children}) {
    const [onoshilgoo, setOnoshilgoo] = React.useState(false);

    const onoshilgooTuluw = (st) => {
        setOnoshilgoo(st)
    };

  return (
    <LogicContext.Provider value={{onoshilgoo, onoshilgooTuluw}}>{children}</LogicContext.Provider>
  );
}

export const useLogic = () => React.useContext(LogicContext);
