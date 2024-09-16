import "./alert.css";
import React from "react";

type Props = {
  title: string;
  message: string;
};
export function Alert(props: Props) {
  const { title, message } = props;
  return (
    <div className="alert-wrapper">
      <img src="/assets/alert.png" className="alert-image" />
      <div className="alert-content">
        <span className="alert-title">{title}</span>
        <span className="alert-message">{message}</span>
      </div>
    </div>
  );
}
