"use client";

import React, { useEffect, useState } from "react";

function Index() {
  const [message, setmessage] = useState("Loading");
  useEffect(() => {
    fetch("http://localhost:8080/api/home")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setmessage(data.message);
      });
  }, []);
  return <div>{message}</div>;
}

export default Index;
