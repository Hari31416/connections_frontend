import React from 'react';
import { useApp } from '../../context/AppContext';

const ModalBackdrop = ({ show }) => (
  <div
    className={`modal-backdrop fade ${show ? "show" : ""}`}
    style={{ display: show ? "block" : "none" }}
  ></div>
);

export default ModalBackdrop;