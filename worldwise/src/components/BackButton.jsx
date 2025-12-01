import Button from "./Button";
import { useNavigate } from "react-router-dom";

function BackButton() {
    const navigate = useNavigate();

  return (
    <Button
      type="back"
      onClick={(e) => {
        e.preventDefault(); //meggátolja hogy lefusson automatikusan rendereléskor
        navigate(-1);
      }}
    >
      &larr; Back
    </Button>
  );
}

export default BackButton;
