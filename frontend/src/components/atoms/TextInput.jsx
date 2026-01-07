import React from "react";

export default function TextInput({ placeholder = "", value, onChange }) {
  return (
    <textarea
      className="text-input"
      placeholder={placeholder}
      rows={6}
      value={value}
      onChange={onChange}
    />
  );
}
