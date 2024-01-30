'use client'
import React from 'react'

interface ButtonPriceProps {
  title: string;
  priceId: string;
}

export const ButtonPrice: React.FC<ButtonPriceProps> = ({ title, priceId }) => {
  const handleClick = async () => {
    console.log("Price ID:", priceId);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        body: JSON.stringify({ priceId }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      window.location.href = data.url
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <button
      className="hover:bg-primary-700 focus:ring-primary-200 dark:focus:ring-primary-900 rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white focus:ring-4  dark:text-white"
      onClick={handleClick}
    >
      {title}
    </button>
  );
};

