import React, { useState, useMemo, useCallback } from 'react';
import './server.scss';
import Input from 'components/Input';
import Button from 'components/Button';
import Control, { Header } from 'components/Control';
import WebSocketContext, { IWebSocketContext } from '../../context/websocket';
import ConnectionStatus from './ConnectionStatus';

const INITIAL_VALUE = 'ws://127.0.0.1:5200';

function Server(): JSX.Element {
  const { connect } = React.useContext<IWebSocketContext>(WebSocketContext);
  const [value, setValue] = useState<string>(INITIAL_VALUE);

  const isConnectDisabled = useMemo(() => value === INITIAL_VALUE, [value]);

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    connect(value);
  }, [value, connect]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const textValue = event.target.value;

    setValue(textValue);
  }, []);

  return (
    <Control id="ws-server">
      <Header title="Server">
        <ConnectionStatus />
      </Header>
      <form id="server-form" onSubmit={handleSubmit}>
        <Input
          id="input"
          type="text"
          value={value}
          label="URL"
          name="url"
          placeholder="wss://"
          onChange={handleChange}
        />
        <Button
          id="button"
          text="Connect"
          type="submit"
          intent="primary"
          disabled={isConnectDisabled}
        />
      </form>
    </Control>
  );
}

export default Server;
