export const sendFrame = async (formData) => {
    const response = await fetch("http://localhost:8000/process-frame/", {
      method: "POST",
      body: formData,
    });
  
    return response.json();
  };
  