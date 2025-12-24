import { useChat } from "../context/ChatContext";

type Props = {
  id: number;
  title: string;
};

const SessionTile = (props: Props) => {
  const { loadSession } = useChat();

  return (
    <div className="sessionContainer" onClick={() => loadSession(props.id)}>
      {props.title}
    </div>
  );
};

export default SessionTile;
