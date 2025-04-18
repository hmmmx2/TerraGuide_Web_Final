import { useEffect } from "react";

export default function Screenshot() {
  useEffect(() => {
    const handlePrintScreen = (e) => {
      if (e.key === "PrintScreen") {
        navigator.clipboard.writeText("");
        document.body.style.filter = "blur(10px)";
        alert("Screenshots are disabled!");
        setTimeout(() => {
          document.body.style.filter = "none";
        }, 1500);
      }
    };

    const handlePrintBlock = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
        e.preventDefault();
        e.stopImmediatePropagation();
        alert("Printing is disabled on this site.");
      }
    };

    document.addEventListener("keyup", handlePrintScreen);
    document.addEventListener("keydown", handlePrintBlock);

    // Cleanup on unmount
    return () => {
      document.removeEventListener("keyup", handlePrintScreen);
      document.removeEventListener("keydown", handlePrintBlock);
    };
  }, []);

  return null; // No visible UI needed
}
