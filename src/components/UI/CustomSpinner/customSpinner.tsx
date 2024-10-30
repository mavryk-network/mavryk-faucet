import React from "react";
import Icon from "~/components/UI/Icon/Icon";
import './customSpinner.css';

export function CustomSpinner() {
  return (
    <div className="loader-icon-wrapper">
      <Icon icon="loader" className="loader-icon" />
    </div>
  );
}
