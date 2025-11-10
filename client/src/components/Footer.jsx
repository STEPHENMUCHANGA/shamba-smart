import React from "react";

export default function Footer() {
  return (
    <footer className="bg-green-700 text-white py-4 text-center mt-auto">
      <p className="text-sm">
        © {new Date().getFullYear()} ShambaSmart. All rights reserved.
      </p>
    </footer>
  );
}
