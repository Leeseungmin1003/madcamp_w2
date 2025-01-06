import React, { useState } from "react";
import "../Page/css/Home.css";
import { TypingMultiline } from "react-kr-typing-anim";
import Button from "react-bootstrap/Button";

function Home() {
  const [show, setShow] = useState(false);

  const str1 = "야, 너도 할 수 있어";
  const str2 = `유튜브`;

  return (
    <div id="home" className="HomeTop">
      <TypingMultiline
        className="typing-1"
        ContainerTag="span"
        Tag="h2"
        strs={`${str1}`}
      />
      <div>
        <TypingMultiline
          className="typing-2"
          preDelay={3500}
          ContainerTag="span"
          Tag="h2"
          strs={`${str2}`}
          onDone={() => setShow(true)}
        />
      </div>
      {show && (
        <div className="Link-area">
          <div className="my-link">
            <Button variant="primary" className="button">
              시작하기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
