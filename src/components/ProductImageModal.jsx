import React, { useState } from "react";
import { X } from "lucide-react";

export default function ProductImageModal({ isOpen, onClose, imageUrl, productName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors z-10"
      >
        <X className="w-6 h-6" />
      </button>
      <div className="max-w-4xl max-h-full flex items-center justify-center">
        <img
          src={imageUrl}
          alt={productName}
          className="max-w-full max-h-full object-contain"
          onClick={onClose}
        />
      </div>
    </div>
  );
}